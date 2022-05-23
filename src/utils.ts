import { IChange, Operation } from "./types";

export const isLeafNode = (change: IChange): boolean => !change.changes || (change.value != null) || change.type === Operation.REMOVE;

export const getTypeOfObj = (obj: Object): string | null => {
    if (typeof obj === 'undefined')
        return 'undefined'

    if (obj === null)
        return null

    // @ts-ignore: Object is possibly 'null'.
    return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
};

export const convertIntervalToPercentage = (interval: number[]) => {
    return parseFloat((interval[1] - interval[0]).toFixed(2)) * 100;
}

export const convertPercentageToInterval = (percentageStr: string): number[] => {
    return [0, (+percentageStr / 100)];
}