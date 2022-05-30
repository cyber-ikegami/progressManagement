import { AnkenInfo } from "../anken/ankenTab";
import { DaigakuInfo } from "../daigaku/daigakuTab";
import { sendQueryRequestToAPI } from "./dataBaseUtil";
import DefineUtil from "./defineUtil";

namespace QueryUtil {
    ////////////////////////////////////////
    // 大学タブ
    ////////////////////////////////////////

    // 大学の取得
    export const findDaigakuList = async () => {
        const response = await sendQueryRequestToAPI('select', `SELECT customid, daigakunam from daigaku  order by customid`);
        const results = await response.json();
        return results as DaigakuInfo[];
    };

    ////////////////////////////////////////
    // 案件タブ
    ////////////////////////////////////////

    // 案件IDの最大値を取得
    export const findMaxAnkenId = async () => {
        const response = await sendQueryRequestToAPI('select',
            `SELECT max(ankenid) as maxid from anken`);
        const results = await response.json();
        return results;
    };

    /**
     * 案件の検索
     * @param status 緊急度 
     * @param maxAnkenId 最大案件ID
     */
    export const findAnkenList = async (status: string, maxAnkenId: string) => {
        // 条件が入力されていたらwhere句を追加
        let joken = '';
        if (status != '') {
            joken = `where a.status <= '${status}'`;
        } else if (maxAnkenId != '') {
            joken = `where a.ankenid = '${maxAnkenId}'`;
        }

        const response = await sendQueryRequestToAPI('select',
            `SELECT a.ankenid, a.status, a.ankentype, a.customid, d.daigakunam, a.start_dy, a.update_dy,
        a.ankenno, a.title, a.detail, null as jissekiList
        from anken a
        left outer join daigaku d
        on a.customid = d.customid
        ${joken}`);
        const results = await response.json();
        return results as AnkenInfo[];
    };

    // 案件の追加
    export const insertAnken = async (ankenType: string, ankenno: string, title: string, start_dy: string, detail: string, nextAnkenId: number, customId: string) => {
        await sendQueryRequestToAPI('update',
            `INSERT INTO anken values ('${nextAnkenId}', '${ankenType}', '${customId}', '${ankenno}', '${title}', '${detail}}', '0', '${start_dy}', '')`);
    };

    // 案件の更新
    export const updateAnken = async (ankenType: string, ankenno: string, title: string, start_dy: string, detail: string, ankenId: number, customId: string) => {
        await sendQueryRequestToAPI('update',
            `UPDATE anken SET ankentype = '${ankenType}', customid = '${customId}', ankenno = '${ankenno}', title = '${title}', detail = '${detail}', start_dy = '${start_dy}' where ankenid = '${ankenId}'`);
    };

    // 案件の削除
    // 案件テーブルの削除
    export const deleteAnken = async (ankenid: number) => {
        await sendQueryRequestToAPI('update',
            `DELETE from anken where ankenid = '${ankenid}'`);
    }
    // 履歴テーブルの削除
    export const deleteRireki = async (ankenid: number) => {
        await sendQueryRequestToAPI('update',
            `DELETE from rireki where ankenid = '${ankenid}'`);
    }
    // 実績テーブルの削除
    export const deleteAnkenJisseki = async (ankenid: number) => {
        await sendQueryRequestToAPI('update',
            `DELETE from jisseki where ankenid = '${ankenid}'`);
    };

    // 案件履歴の検索
    export const findRirekiList = async (ankenid: number) => {
        const response = await sendQueryRequestToAPI('select',
            `SELECT r.rirekiseq, r.state, r.detail
    from rireki r
    inner join anken a
    on r.ankenid = a.ankenid
    where a.ankenid = '${ankenid}'
    order by r.ankenid, r.rirekiseq desc`);
        const results = await response.json();
        return results;
    };

    // 履歴連番の最大値を取得
    export const findMaxRirekiseq = async (ankenid: number) => {
        const response = await sendQueryRequestToAPI('select',
            `SELECT max(rirekiseq) as maxSeq from rireki where ankenid = '${ankenid}'`);
        const results = await response.json();
        return results;
    };

    
    /**
     * 案件履歴の追加
     * @param ankenid 案件ID
     * @param state 状態
     * @param detail 備考
     * @param rirekiseq 履歴連番
     */
    export const insertRireki = async (ankenid: number, state: string, detail: string, rirekiseq: number) => {
        await sendQueryRequestToAPI('update',
            `INSERT INTO rireki values ('${ankenid}', '${rirekiseq}', '${state}', '${detail}')`);
    };

    /**
     * 案件の緊急度の更新
     * @param ankenid 案件ID
     * @param status 緊急度
     * @param update_dy 更新日(システム日付)
     */
    export const updateAnkenStatus = async (ankenid: number, status: string, update_dy: string) => {
        await sendQueryRequestToAPI('update',
            `UPDATE anken SET status = '${status}', update_dy = '${update_dy}' where ankenid = ${ankenid}`);
    };

    // 案件実績の検索
    export const findJissekiList = async (ankenid: number) => {
        const response = await sendQueryRequestToAPI('select',
            `SELECT j.jisekiseq, j.sagyou_dy, j.user, j.worktype, j.time
    from jisseki j
    inner join anken a
    on j.ankenid = a.ankenid
    where a.ankenid = '${ankenid}'
    order by j.ankenid, j.sagyou_dy desc`);
        const results = await response.json();
        return results;
    };

    // 実績連番の最大値を取得
    export const findMaxJisekiseq = async (ankenid: number) => {
        const response = await sendQueryRequestToAPI('select',
            `SELECT max(jisekiseq) as maxSeq from jisseki where ankenid = '${ankenid}'`);
        const results = await response.json();
        return results;
    };

    // 案件実績の追加
    export const insertJisseki = async (ankenid: number, sagyou_dy: string, user: string, workType: string, time: string, jisekiseq: number) => {
        await sendQueryRequestToAPI('update',
            `INSERT INTO jisseki values ('${ankenid}', '${jisekiseq}', '${sagyou_dy}', '${user}', '${workType}', '${time}')`);
    };

    // 案件実績の削除
    export const deleteJisseki = async (ankenid: number, jisekiseq: number) => {
        await sendQueryRequestToAPI('update',
            `DELETE from jisseki where ankenid = '${ankenid}' and jisekiseq = '${jisekiseq}'`);
    };
    
    ////////////////////////////////////////
    // 機能タブ
    ////////////////////////////////////////

    // SEのJSONデータの取得
    export const getJsonData = async (values: string) => {
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

    // EEのJSONデータの取得
    export const getEEJsonData = async (customId: string, start_dy: string, end_dy: string) => {
        const response = await sendQueryRequestToAPI('select',
            `select j.sagyou_dy, a.title, j.user, round((cast(j.time as REAL)/60), 1)
            from jisseki j inner join anken a on a.ankenid = j.ankenid
            where j.sagyou_dy between '${start_dy}' and '${end_dy}' and a.customid = '${customId}'
            order by j.sagyou_dy`);
        const json = await response.json();
        return json;
    };    
};

export default QueryUtil;