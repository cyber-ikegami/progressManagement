// 入力欄のタイプ
// type InputType = 'textField';

export type FormInfo = {
    // 項目名label
    labelName: string;
    // 項目の値
    value: string;
    // 入力欄のタイプ
    // type?: InputType;
}

export type FunctionFormProps = {

    // ダイアログに関する情報
    formList: FormInfo[];
    // ボタン押下時の処理
    execute: (inputValues: string[], setResultValue: (value: string) => void) => void;
}

abstract class AbstractFunctionBuilder {
    abstract getFunctionName(): string;
    abstract getFormProps(): FunctionFormProps;

    convertJsonToCsv(objs: object[]): string {
        const header: string[] = [];
        const records: string[] = [];
        objs.forEach((obj, i) => {
            const record: string[] = [];
            Object.entries(obj).forEach(data => {
                if (i === 0) {
                    header.push(data[0]);
                }
                record.push(data[1]);
            });
            records.push(record.join(', '));
        });
        console.log(header.join(', '));
        console.log(records.join('\n'));

        return '';
    }
}

export default AbstractFunctionBuilder;