import { useEffect, useMemo, useState } from "react";
import { findDaigakuList } from "./daigakuTab";

type daigakuType = {
    // カスタムID
    customid: string;
    // 大学名
    daigakunam: string;
}

type ankenType = {
    // 緊急度
    status: number;
    // 案件タイプ(SE/EE/PKG)
    ankentype: string;
    // カスタムID
    customid: string;
    // 大学名
    daigakunam: string;
    // 対応開始日
    start_dy: string;
    // 最終更新日
    update_dy: string;
    // 案件番号
    ankenno: number;
    // 案件タイトル
    title: string;
    // 詳細
    detail: string;
}

// 案件詳細タブ
const AnkenSyosai = (props: {
    selectAnken: ankenType;
}) => {
    const [daigakuList, setDaigakuList] = useState<daigakuType[]>([]);

    // useEffect(() => {
    //     findDaigakuList().then(value => {
    //         setDaigakuList(value);
    //     });
    // }, []);

    // const customJsxList: JSX.Element[] = useMemo(() => {
    //     return daigakuList.map((value) =>
    //         <option>{value.customid}:{value.daigakunam}</option>
    //     )
    // }, [daigakuList]);

    return (
        <>
            <span>案件種別</span>
            <select id='ankenType'>
                <option>{props.selectAnken.ankentype}</option>
            </select>

            <span>カスタマID</span>
            <select id='ankenType'>
                {/* {customJsxList} */}
                <option>
                    {props.selectAnken.customid}:{props.selectAnken.daigakunam}
                </option>
            </select>

            <span>案件番号</span>
            <input type="text" value={props.selectAnken.ankenno} onChange={(e) => {

            }} />
            <span>案件タイトル</span>
            <input type="text" value={props.selectAnken.title} onChange={(e) => {

            }} />
            <span>発生日</span>
            <input type="text" value={props.selectAnken.start_dy} onChange={(e) => {

            }} />
            <span>詳細</span>
            <textarea value={props.selectAnken.detail}></textarea>
        </>
    );
}

export default AnkenSyosai;