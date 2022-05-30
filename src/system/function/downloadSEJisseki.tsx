import QueryUtil from "../utils/queryUtil";
import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadSEJisseki extends AbstractFunctionBuilder {
    getFunctionName(): string {
        return 'SE_CSVダウンロード';
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                { labelName: '対象年', value: String(this.getSystemDate()[0]) },
                { labelName: '対象月', value: String(this.getSystemDate()[1]) }
            ],
            execute: (values, setResultValue) => {
                const json = QueryUtil.getJsonData(this.getTargetDate(values));
                json.then((values) => {
                    setResultValue(this.convertTable(values))
                })
            }
        };
    };

    // システム日付の取得
    getSystemDate = () => {
        let today = new Date();
        const year = ('0000' + today.getFullYear()).slice(-4);
        const month = ('00' + (today.getMonth() + 1)).slice(-2);
        return [year, month];
    };

    // 対象日の取得
    getTargetDate = (values: string[]) => {
        let toYear = ('0000' + values[0]).slice(-4);
        let toMonth = ('00' + (String(Number(values[1]) - 1))).slice(-2);
        const fromYear = ('0000' + values[0]).slice(-4);
        const fromMonth = ('00' + (values[1])).slice(-2);

        if (values[1] === '1') {
            toYear = String(Number(toYear) - 1);
            toMonth = '12';
        }

        return (`'${toYear}/${toMonth}/21' and '${fromYear}/${fromMonth}/20'`);
    };
};

export default DownloadSEJisseki;