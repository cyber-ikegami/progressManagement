import QueryUtil from "../utils/queryUtil";
import AbstractFunctionBuilder from "./abstractFunctionBuilder";

namespace DownloadPKGJisseki {
    export class Component extends AbstractFunctionBuilder.Component {
        getFunctionName(): string {
            return 'PKG連絡票_CSVダウンロード';
        };
        getFormProps(): AbstractFunctionBuilder.FunctionFormProps {
            return {
                formList: [
                    {
                        labelName: '案件種別', value: 'PKG連絡票', type: 'comboBox',
                        optionList: [{ optionValue: 'PKG連絡票', showValue: 'PKG連絡票' }, { optionValue: 'PKG連絡票(Xs)', showValue: 'PKG連絡票(Xs)' }]
                    },
                    { labelName: '開始日', value: this.getSystemDate() },
                    { labelName: '終了日', value: this.getSystemDate() }
                ],
                execute: (values, setResultValue) => {
                    const json = QueryUtil.getPKGJsonData(values[0], values[1], values[2]);
                    json.then((values) => {
                        setResultValue(this.convertTable(values))
                    })
                }
            };
        }

        /**
         * システム日付の取得
         * @returns システム日付(XXXX/XX/XX)
         */
        getSystemDate = () => {
            let today = new Date();
            const year = ('0000' + today.getFullYear()).slice(-4);
            const month = ('00' + (today.getMonth() + 1)).slice(-2);
            const day = ('00' + today.getDate()).slice(-2);
            return year + '/' + month + '/' + day;
        };
    };
};

export default DownloadPKGJisseki;