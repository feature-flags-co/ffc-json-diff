export interface IChange {
    type: string,
    key: string,
    oldValue?: ChangeValue,
    value?: ChangeValue,
    embededKey?: string,
    changes?: IChange[],
}

export enum Operation {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    UPDATE = 'UPDATE',
}

export type ChangeValue = any;
export type ObjectType = {[key: string]: any};
export type PrimitiveType = string | boolean | number; // Date is converted to number by calling the method getTime()
