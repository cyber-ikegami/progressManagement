// 入力欄のタイプ
type InputType = 'textField';

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
    // execute: (formValues: string[]) => void;
}

abstract class AbstractFunctionBuilder {
    abstract getFunctionName(): string;
    abstract getFunctionList(): FunctionFormProps;
}

export default AbstractFunctionBuilder;