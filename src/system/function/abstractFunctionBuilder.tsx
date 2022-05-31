namespace AbstractFunctionBuilder {
    export type FormInfo = {
        // 項目名label
        labelName: string;
        // 項目の値
        value: string;
    }

    export type FunctionFormProps = {
        // ダイアログに関する情報
        formList: FormInfo[];
        // ボタン押下時の処理
        execute: (inputValues: string[], setResultValue: (value: string) => void) => void;
    }

    // abstract class AbstractFunctionBuilder {
    export abstract class Component {
        abstract getFunctionName(): string;
        abstract getFormProps(): FunctionFormProps;

        convertTable(json: object[]): string {
            const records: string[] = [];
            json.forEach((obj) => {
                const record: string[] = [];
                Object.entries(obj).forEach(data => {
                    record.push(data[1]);
                });
                records.push(record.join('\t'));
            });

            const resultTable = (records.join('\n'));
            return resultTable;
        }
    }
};

export default AbstractFunctionBuilder;