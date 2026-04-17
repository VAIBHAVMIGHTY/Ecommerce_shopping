export default function handleAsyncError(myErrorFun) {
    return function (req, res, next) {
        Promise.resolve(myErrorFun(req, res, next)).catch(next);
    };
}
