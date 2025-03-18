export type vehicle_cost = {
    cs: number,
    cm: number,
    el: number,
    er: number,
    cs_upkeep: number
}

export type param_type = {
    id: string;
    label: string;
    type: "number" | "select" | "text";
    step?: number;
    options?: string[];
    default?: number | string;
};