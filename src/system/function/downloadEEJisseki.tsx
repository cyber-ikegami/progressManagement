import { sendQueryRequestToAPI } from "../utils/dataBaseUtil";
import AbstractFunctionBuilder, { FunctionFormProps } from "./abstractFunctionBuilder";

class DownloadEEJisseki extends AbstractFunctionBuilder {
    getFunctionName(): string {
        return 'EE_CSVダウンロード';
    };
    getFormProps(): FunctionFormProps {
        return {
            formList: [
                { labelName: 'カスタマID(032:都市大/074:鎌女)', value: '032' },
                { labelName: '開始日', value: this.getSystemDate() },
                { labelName: '終了日', value: this.getSystemDate() }
            ],
            execute: (values, setResultValue) => {
                const json = getJsonData(values);
                json.then((values) => {
                    setResultValue(this.convertTable(values))
                })
            }
        };
    }

    // システム日付の取得
    getSystemDate = () => {
        let today = new Date();
        const year = ('0000' + today.getFullYear()).slice(-4);
        const month = ('00' + (today.getMonth() + 1)).slice(-2);
        const day = ('00' + today.getDate()).slice(-2);
        return year + '/' + month + '/' + day;
    };
};

const getJsonData = async (values: string[]) => {
    const response = await sendQueryRequestToAPI('select',
        `select j.sagyou_dy, a.title, j.user, round((cast(j.time as REAL)/60), 1)
        from jisseki j inner join anken a on a.ankenid = j.ankenid
        where j.sagyou_dy between '${values[1]}' and '${values[2]}' and a.customid = '${values[0]}'
        order by j.sagyou_dy`);
    const json = await response.json();
    return json;
};

export default DownloadEEJisseki;