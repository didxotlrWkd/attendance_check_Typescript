import { Exclude, Expose } from "class-transformer";


export class ResponseEntity<T> {
    @Exclude() private readonly _isSuccess: boolean;
    @Exclude() private readonly _statusCode : number;
    @Exclude() private readonly _data: T;

    private constructor(
        isSuccess: boolean,
        statusCode: number,
        data? : T | undefined,
    ){
        this._isSuccess = isSuccess;
        this._statusCode = statusCode;
        this._data = data;
    }

    @Expose()
    get isSuccess(){
        return this._isSuccess
    }

    @Expose()
    get statusCode(){
        return this._statusCode;
    }

    @Expose()
    get data() {
        return this._data;
    }

    static ok(statusCode : number) : ResponseEntity<undefined> {
        return new ResponseEntity(true, statusCode);
    }

    static ok_with<T>(statusCode : number , data : T): ResponseEntity<T> {
        return new ResponseEntity<T>(true, statusCode ,data)
    }
}