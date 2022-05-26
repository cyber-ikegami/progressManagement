import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import DefineUtil from "../utils/defineUtil";
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

const getJsonData = async (values: string) => {
    const kubunList = DefineUtil.SAGYOU_KUBUN_LIST.map((value => {
        return `when '${value.key}' then '${value.key}.${value.value}'`;
    }));

    const response = await sendQueryRequestToAPI('select',
        `select j.sagyou_dy, (select customid ||'_'|| daigakunam from daigaku where customid = a.customid), a.ankenno, 
        '' as kara1, '' as kara2, a.title, j.user, case j.worktype ${kubunList.join(' ')} else '' end, j.time
        from jisseki j
        inner join anken a on a.ankenid = j.ankenid
        where j.sagyou_dy between ${values} and a.ankentype = 'SE'
        order by j.sagyou_dy`);
    const json = await response.json();
    return json;
};

export default DownloadSEJisseki;