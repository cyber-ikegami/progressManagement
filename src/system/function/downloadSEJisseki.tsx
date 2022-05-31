import QueryUtil from "../utils/queryUtil";
import AbstractFunctionBuilder from "./abstractFunctionBuilder";

namespace DownloadSEJisseki {
    export class Component extends AbstractFunctionBuilder.Component {
        getFunctionName(): string {
            return 'SE_CSVダウンロード';
        };
        getFormProps(): AbstractFunctionBuilder.FunctionFormProps {
            return {
                formList: [
                    { labelName: '対象年', value: String(this.getSystemDate()[0]) },
                    { labelName: '対象月', value: String(this.getSystemDate()[1]) }
                ],
                execute: (values, setResultValue) => {
                    const json = QueryUtil.getSEJsonData(this.getTargetDate(values));
                    json.then((values) => {
                        setResultValue(this.convertTable(values))
                    })
                }
            };
        };

        /**
         * システム日付の取得
         * @returns システム日付(年月)
         */
        getSystemDate = () => {
            let today = new Date();
            const year = ('0000' + today.getFullYear()).slice(-4);
            const month = ('00' + (today.getMonth() + 1)).slice(-2);
            return [year, month];
        };

        /**
         * 取得対象日の取得
         * @param date 対象年月
         * @returns 取得対象日('XXXX/XX/21' and 'XXXX/XX/20')
         */
        getTargetDate = (date: string[]) => {
            let toYear = ('0000' + date[0]).slice(-4);
            let toMonth = ('00' + (String(Number(date[1]) - 1))).slice(-2);
            const fromYear = ('0000' + date[0]).slice(-4);
            const fromMonth = ('00' + (date[1])).slice(-2);

            if (date[1] === '1') {
                toYear = String(Number(toYear) - 1);
                toMonth = '12';
            }

            return (`'${toYear}/${toMonth}/21' and '${fromYear}/${fromMonth}/20'`);
        };
    };
};

export default DownloadSEJisseki;