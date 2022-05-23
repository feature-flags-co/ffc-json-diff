import _ from 'lodash';
import { IChange, ObjectType, Operation, PrimitiveType } from './types';
import { getTypeOfObj, isLeafNode } from './utils';

const _intersection = _.intersection;
const _difference = _.difference;
const _keyBy = _.keyBy;


class Changeset {
    // embededObjKeys: define keys for arrays
    diff(oldObj: Object, newObj: Object, embededObjKeys: ObjectType): IChange[] {
        return compare(oldObj, newObj, [], embededObjKeys, []);
    };
    applyChanges(obj: Object, changesets: IChange[]) {
        const results: any[] = []; // result of each operation, not usefull
        
        changesets.forEach((change: IChange) => {
            if (isLeafNode(change)) {
                results.push(applyLeafChange(obj, change, change.embededKey));
            } else {
                results.push(applyBranchChange(obj[change.key], change));
            }
        });

        return results;
    };
    revertChanges(obj: Object, changesets: IChange[]) {
        const results: any[] = []; // result of each operation, not usefull

        changesets.reverse().forEach((change: IChange) => {
            if (!change.changes) {
                results.push(revertLeafChange(obj, change));
            } else {
                results.push(revertBranchChange(obj[change.key], change));
            }
        });

        return results;
    };
}

const changeset = new Changeset();
export default changeset;

const getKey = (path: string[]) => {
    const ref = path[path.length - 1];
    return ref !== null ? ref : '$root';
};

const compare = (oldObj: Object, newObj: Object, path: string[], embededObjKeys: ObjectType, keyPath: string[]) => {
    let changes: IChange[] = [];
    const typeOfOldObj: string | null = getTypeOfObj(oldObj);
    const typeOfNewObj: string | null = getTypeOfObj(newObj);

    let diffs: IChange[];
    
    if (typeOfOldObj !== typeOfNewObj) {
        changes.push({
            type: Operation.REMOVE,
            key: getKey(path),
            value: oldObj
        });
        changes.push({
            type: Operation.ADD,
            key: getKey(path),
            value: newObj
        });
        return changes;
    }

    switch (typeOfOldObj) {
        case 'Date':
            changes = [...changes, ...comparePrimitives((oldObj as Date).getTime(), (newObj as Date).getTime(), path)];
            break;
        case 'Object':
            diffs = compareObject(oldObj, newObj, path, embededObjKeys, keyPath);
            if (diffs.length) {
                if (path.length) {
                    changes = [...changes, {
                        type: Operation.UPDATE,
                        key: getKey(path),
                        changes: diffs
                    }];
                } else {
                    changes = [...changes, ...diffs];
                }
            }
            break;
        case 'Array':
            changes = [...changes, ...compareArray(oldObj as any[], newObj as any[], path, embededObjKeys, keyPath)];
            break;
        case 'Function':
            break;
        default:
            changes = [...changes, ...comparePrimitives(oldObj as PrimitiveType, newObj as PrimitiveType, path)];
    }
    return changes;
};

const compareObject = (oldObj: Object, newObj: Object, path: string[], embededObjKeys: ObjectType, keyPath: string[], skipPath?: boolean): IChange[] => {
    if (skipPath == null) {
        skipPath = false;
    }

    let changes: IChange[] = [];
    const oldObjKeys: string[] = Object.keys(oldObj);
    const newObjKeys: string[] = Object.keys(newObj);
    const intersectionKeys: string[] = _intersection(oldObjKeys, newObjKeys);

    for (let i = 0, len = intersectionKeys.length; i < len; i++) {
        const k = intersectionKeys[i];
        const newPath = path.concat([k]);
        const newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
        const diffs = compare(oldObj[k], newObj[k], newPath, embededObjKeys, newKeyPath);
        if (diffs.length) {
            changes = changes.concat(diffs);
        }
    }
    const addedKeys: string[] = _difference(newObjKeys, oldObjKeys);
    for (let i = 0, len = addedKeys.length; i < len; i++) {
        const k = addedKeys[i];
        const newPath = path.concat([k]);
        //const newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
        changes.push({
            type: Operation.ADD,
            key: getKey(newPath),
            value: newObj[k]
        });
    }
    const deletedKeys: string[] = _difference(oldObjKeys, newObjKeys);
    for (let i = 0, len = deletedKeys.length; i < len; i++) {
        const k = deletedKeys[i];
        const newPath = path.concat([k]);
        //const newKeyPath = skipPath ? keyPath : keyPath.concat([k]);
        changes.push({
            type: Operation.REMOVE,
            key: getKey(newPath),
            value: oldObj[k]
        });
    }
    return changes;
};

const compareArray = (oldObj: any[], newObj: any[], path: string[], embededObjKeys: ObjectType, keyPath: string[]): IChange[] => {
    const _ref = embededObjKeys != null ? embededObjKeys[keyPath.join('.')] : void 0;
    const uniqKey: string = _ref != null ? _ref : '$index';
    const indexedOldObj: ObjectType = convertArrayToObj(oldObj, uniqKey);
    const indexedNewObj: ObjectType = convertArrayToObj(newObj, uniqKey);
    const diffs: IChange[] = compareObject(indexedOldObj, indexedNewObj, path, embededObjKeys, keyPath, true);
    if (diffs.length) {
        return [
            {
                type: Operation.UPDATE,
                key: getKey(path),
                embededKey: uniqKey,
                changes: diffs
            }
        ];
    } else {
        return [];
    }
};

const convertArrayToObj = (arr: any[], uniqKey: string): ObjectType => {
    if (uniqKey !== '$index') {
        return _keyBy(arr, uniqKey);
    } else {
        return arr.reduce((acc, cur, idx) => {
            acc[idx] = cur;
            return acc;
        }, {});   
    }
};

const comparePrimitives = (oldObj: PrimitiveType, newObj: PrimitiveType, path: string[]): IChange[] => {
    const changes: IChange[] = [];
    if (oldObj !== newObj) {
        changes.push({
            type: Operation.UPDATE,
            key: getKey(path),
            value: newObj,
            oldValue: oldObj
        });
    }
    return changes;
};

const isEmbeddedKey = function (key: string): boolean {
    return /\$.*=/gi.test(key);
};

const removeKey = function (obj: Object, key: string | number, embededKey: string) {
    var index;
    if (Array.isArray(obj)) {
        if (embededKey !== '$index' || !obj[key]) {
            index = indexOfItemInArray(obj, embededKey, key);
        }
        return obj.splice(index != null ? index : key, 1);
    } else {
        return delete obj[key];
    }
};
const indexOfItemInArray = function (arr, key, value) {
    for (let index = 0; index < arr.length; index++) {
        const item = arr[index];
        if (key === '$index') {
            if (item === value) {
                return index;
            }
        } else if (item[key] === value) {
            return index;
        }
    }
    return -1;
};
const modifyKeyValue = function (obj: Object, key: string, value: any) {
    return obj[key] = value;
};
const addKeyValue = function (obj: Object, key: string, value: any) {
    if (Array.isArray(obj)) {
        return obj.push(value);
    } else {
        return obj[key] = value;
    }
};
const parseEmbeddedKeyValue = function (key) {
    var uniqKey, value;
    uniqKey = key.substring(1, key.indexOf('='));
    value = key.substring(key.indexOf('=') + 1);
    return {
        uniqKey: uniqKey,
        value: value
    };
};
const applyLeafChange = function (obj, change: IChange, embededKey?: string) {
    const type = change.type, key = change.key, value = change.value;
    switch (type) {
        case Operation.ADD:
            return addKeyValue(obj, key, value);
        case Operation.UPDATE:
            return modifyKeyValue(obj, key, value);
        case Operation.REMOVE:
            return removeKey(obj, key, embededKey!);
    }
};
const applyArrayChange = function (arr: any[], change: IChange) {
    const results: any[] = [];

    change.changes?.forEach((subchange: IChange) => {
        if ((subchange.value != null) || subchange.type === Operation.REMOVE) {
            results.push(applyLeafChange(arr, subchange, change.embededKey));
        } else {
            let element;
            if (change.embededKey === '$index') {
                element = arr[+subchange.key];
            } else {
                element = arr.find(el => el[change.embededKey!] == subchange.key); // can only use == to compare 
            }
            results.push(changeset.applyChanges(element, subchange.changes!));
        }
    });

    return results;
};
const applyBranchChange = function (obj, change: IChange) {
    if (Array.isArray(obj)) {
        return applyArrayChange(obj, change);
    } else {
        return changeset.applyChanges(obj, change.changes!);
    }
};
const revertLeafChange = function (obj, change: IChange, embededKey?: string) {
    const type = change.type, key = change.key, value = change.value, oldValue = change.oldValue;
    switch (type) {
        case Operation.ADD:
            return removeKey(obj, key, embededKey!);
        case Operation.UPDATE:
            return modifyKeyValue(obj, key, oldValue);
        case Operation.REMOVE:
            return addKeyValue(obj, key, value);
    }
};
const revertArrayChange = function (arr: any[], change: IChange) {
    const results: any[] = [];

    change.changes?.forEach((subchange: IChange) => {
        if ((subchange.value != null) || subchange.type === Operation.REMOVE) {
            results.push(revertLeafChange(arr, subchange, change.embededKey));
        } else {
            let element;
            if (change.embededKey === '$index') {
                element = arr[+subchange.key];
            } else {
                element = arr.find(el => el[change.embededKey!] == subchange.key);
            }
            results.push(changeset.revertChanges(element, subchange.changes!));
        }
    });

    return results;
};
const revertBranchChange = function (obj, change: IChange) {
    if (Array.isArray(obj)) {
        return revertArrayChange(obj, change);
    } else {
        return changeset.revertChanges(obj, change.changes!);
    }
};