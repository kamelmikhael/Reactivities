import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError.model";

export default class CommonStore {
    error: ServerError | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setServerError = (error: ServerError | null) => {
        this.error = error;
    }
}