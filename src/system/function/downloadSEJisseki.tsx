import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
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
                const json = getJsonData(this.getTargetDate(values));
                json.then((values) => {
                    setResultValue(this.convertJsonToCsv(values))
                })
                
                // console.log(getJsonData(values));
                // return this.convertJsonToCsv(getJsonData(this.getTargetDate(values)));
                // return ('');
            }
        };
    };

    // システム日付の取得
    getSystemDate = () => {
        let today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        return [year, month];
    };
    
    // 対象日の取得
    getTargetDate = (values: string[]) => {
        let toYear = values[0];
        let toMonth = String(Number(values[1]) - 1);
        const fromYear = values[0];
        const fromMonth = values[1].length === 1 ? `0${values[1]}` : values[1];
    
        if (values[1] === '1') {
            toYear = String(Number(toYear) - 1);
            toMonth = '12';
        }
    
        toMonth = toMonth.length === 1 ? `0${toMonth}` : toMonth;
    
        return (`'${toYear}/${toMonth}/21' and '${fromYear}/${fromMonth}/20'`);
    };
};

const getJsonData = async (values: string) => {
    const response = await sendQueryRequestToAPI('select',
        `select j.sagyou_dy, a.customid, a.ankenno, a.title, j.user, j.worktype, j.time
        from jisseki j
        inner join anken a on a.ankenid = j.ankenid
        where j.sagyou_dy between ${values} and a.ankentype = 'SE'
        order by j.sagyou_dy`);
    const json = await response.json();
    return json;
};

export default DownloadSEJisseki;