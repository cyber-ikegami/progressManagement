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
    execute: (inputValues: string[]) => string;
    // execute: Function;
}

abstract class AbstractFunctionBuilder {
    abstract getFunctionName(): string;
    abstract getFormProps(): FunctionFormProps;
}

export default AbstractFunctionBuilder;