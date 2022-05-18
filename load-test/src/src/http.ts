import http from 'k6/http';

export class MyHttp {
    /**Performs k6 http get with retry */
    get(url: string, params?: any) {
        return this.httpRetry(() => http.get(url, params));
    }

    /**Performs k6 http post with retry */
    post(url: string, payload: any, params: any) {
        return this.httpRetry(() => http.post(url, payload, params));
    }

    private retry(limit: number, fn: () => any, pred: (arg0: any) => any) {
        let result;
        while (limit--) {
            result = fn();
            if (pred(result)) return result;
            console.log("performing retry");
        }
        return result;
    }

    private httpRetry(req: () => any) {
        return this.retry(
            3,
            req,
            r => !(r.status == 408 || r.status >= 500));
    }
}