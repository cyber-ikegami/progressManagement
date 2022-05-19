import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadSEJisseki extends AbstractFunctionBuilder {
    getFunctionName(): string {
        return 'SE_CSVダウンロード';
    };
    getFunctionList(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'ラベル1', value: 'a' }, 
                { labelName: 'ラベル2', value: 'b' }
            ]
            // execute: (values) => { console.log('a'); }
        };
    }
}

export default DownloadSEJisseki;