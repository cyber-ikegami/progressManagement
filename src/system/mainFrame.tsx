import React, { useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import { sendQueryRequestToAPI } from './utils/dataBaseUtil';
// import './App.css';

type daigakuType = {
    customid: string;
    daigakunam: string;
}

const MainFrame = () => {
    // 大学名
    const [daigakuList, setDaigakuList] = useState<daigakuType[]>([]);

    const daigakuJsxList: JSX.Element[] = [];

    daigakuList.forEach((value, i) => {
        const customId = daigakuList[i].customid;
        const daigakuName = daigakuList[i].daigakunam;
        daigakuJsxList.push(<_DaigakuLabel key = {i}><_Custom>[</_Custom><_CustomId>{customId}</_CustomId><_Custom>]: </_Custom><_DaigakuName>{daigakuName}</_DaigakuName></_DaigakuLabel>);
    });

    return (
        <>
            <_Header><button onClick={() => {
                DaigakuFind().then(value => {
                    setDaigakuList(value);
                });

                // setDaigakuList(daigakuList.slice());
            }}>大学</button></_Header>
            <_Left>{daigakuJsxList}</_Left>
            <_Right></_Right>
        </>
    );
}

// SQL(大学名)取得
const DaigakuFind = async () => {
    const response = await sendQueryRequestToAPI('select', `SELECT customid, daigakunam from daigaku`);
    const results = await response.json();
    return results as daigakuType[];
};

export default MainFrame;

// ヘッダー
const _Header = styled.div`
  background-color: #c8e7ed;
  width: 100%;
  height: ${SystemUtil.HEADER_HEIGTH}px;
`;

// 画面左
const _Left = styled.div`
  background-color: #f0f0f0;
  display: inline-block;
  vertical-align: top;
  text-align: left;
  width: 50%;
  height: calc(100% - ${SystemUtil.HEADER_HEIGTH}px);
`;

// 大学名ラベル
const _DaigakuLabel = styled.div`
  background-color: #ffcaca;
  display: inline-block;
  width: calc(100% - 10px);
  height: ${SystemUtil.DAIGAKU_LABEL_HEIGTH}px;
  margin-left: 5px;
  margin-top: 5px;
  font-size: ${SystemUtil.DAIGAKU_CHAR_SIZE}px;
  font-weight: bold;
`;

// カスタムIDの[]:
const _Custom = styled.span`
    color: #9b9b9b;
`;
// カスタムID
const _CustomId = styled.span`
    color: #ac0000;
`;
// 大学名
const _DaigakuName = styled.span`
    color: #2e9e1f;
`;

// 画面右
const _Right = styled.div`
  background-color: #ede2c8;
  display: inline-block;
  margin-left: auto;
  text-align: left;
  width: 50%;
  height: calc(100% - ${SystemUtil.HEADER_HEIGTH}px);
`;