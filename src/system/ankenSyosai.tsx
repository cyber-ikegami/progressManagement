// import { useEffect, useMemo, useState } from "react";
// import { findDaigakuList } from "./daigakuTab";

import styled from "styled-components";
import { AnkenInfo } from "./ankenTab";
import SystemUtil from "./utils/systemUtil";

// 案件詳細タブ
const AnkenSyosai = (props: {
    selectAnken: AnkenInfo;
}) => {
    // const [daigakuList, setDaigakuList] = useState<DaigakuInfo[]>([]);

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
        <_Syosai>
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
            <textarea value={props.selectAnken.detail} onChange={(e) => {

            }} />
        </_Syosai>
    );
}

export default AnkenSyosai;

// 詳細
const _Syosai = styled.div`
    & span {
        font-size: 15px;
        margin-left: 5px;
        font-weight: bold;
    }
    & select, input {
        width: calc(100% - 10px);
        height: ${SystemUtil.JOKEN_TEXT_HEIGHT}px;
        margin-left: 5px;
        margin-bottom: 5px;
        box-sizing: border-box;  
    }
    & textarea {
        width: calc(100% - 10px);
        height: 250px;
        resize: none;
        margin-left: 5px;
        margin-top: 5px;
        box-sizing: border-box; 
    }
`;