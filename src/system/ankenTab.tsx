import React, { useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import { sendQueryRequestToAPI } from './utils/dataBaseUtil';

type ankenType = {
    status: number;
    ankentype: string;
    customid: string;
    daigakunam: string;
    start_dy: string;
    update_dy: string;
    ankenno: number;
    title: string;
}

const AnkenTab = () => {
    const [ankenList, setAnkenList] = useState<ankenType[]>([]);
    const [ankenStatus, setAnkenStatus] = useState<string>('');
    const [focus, setFocus] = useState<number>();

    const ankenJsxList: JSX.Element[] = [];

    ankenList.forEach((value, i) => {
        // 緊急度
        const status = ankenList[i].status;
        // 案件タイプ(SE/EE/PKG)
        const ankenType = ankenList[i].ankentype;
        // カスタムID
        const customId = ankenList[i].customid;
        // 大学名
        const daigakuName = ankenList[i].daigakunam;
        // 対応開始日
        const startDy = ankenList[i].start_dy;
        // 最終更新日
        const updateDy = ankenList[i].update_dy;
        // 案件番号
        const ankenNo = ankenList[i].ankenno;
        // 案件タイトル
        const title = ankenList[i].title;

        ankenJsxList.push(<_AnkenLabel key={i} ankenType={ankenType} onClick={() => {
            setFocus(i);
        }}>
            <_SelectAnkenLabel isSelect={focus === i} />
            <_TopAnkenLabel>
                <_Status>{status}</_Status>
                <_Other> [</_Other>
                <_AnkenType>{ankenType}</_AnkenType>
                <_Other>](</_Other>
                <_Daigaku>{customId}:{daigakuName}</_Daigaku>
                <_Other>): </_Other>
                <_Date>{startDy}～{updateDy}</_Date>
            </_TopAnkenLabel>
            <_BottomAnkenLabel>
                <_AnkenNo>{ankenNo}</_AnkenNo>
                <_Other>) </_Other>
                <_Title>{title}</_Title>
            </_BottomAnkenLabel>
        </_AnkenLabel>);
    }
    );

    return (
        <>
            <_Header>
                <input type="number" min='0' max='100' placeholder="条件(緊急度0～100)を入力" onChange={(e) => {
                    setAnkenStatus(e.target.value);
                }} />
                <_DispButton isEnable={0 <= Number(ankenStatus) && Number(ankenStatus) <= 100} onClick={() => {
                    findAnkenList(ankenStatus).then(value => {
                        setAnkenList(value);
                    });
                }}>表示</_DispButton>
            </_Header>
            <_Left>{ankenJsxList}</_Left>
            <_Right></_Right>
        </>
    );
}

// SQL(案件)取得
const findAnkenList = async (ankenStatus: string) => {
    // 条件が入力されていたらwhere句を追加
    let joken = '';
    if (ankenStatus != '') {
        joken = 'where a.status <= ' + ankenStatus;
    }

    const response = await sendQueryRequestToAPI('select',
        `SELECT a.status, a.ankentype, a.customid, d.daigakunam, a.start_dy, a.update_dy,
        a.ankenno, a.title
        from anken a
        inner join daigaku d
        on a.customid = d.customid
        ${joken}
        order by status`);
    const results = await response.json();
    return results as ankenType[];
};

export default AnkenTab;

// ヘッダー
const _Header = styled.div`
  background-color: #c8e7ed;
  width: 100%;
  height: ${SystemUtil.HEADER_HEIGTH}px;
  & input {
    width: ${SystemUtil.JOKEN_TEXT_WIDTH}px;
    height: ${SystemUtil.JOKEN_TEXT_HEIGHT}px;
    margin-left: 10px;
    margin-top: 10px;
    box-sizing: border-box; 
  }
`;

// 表示ボタン
const _DispButton = styled.div<{
    isEnable: boolean;
}>`
  pointer-events: ${props => props.isEnable ? 'auto' : 'none'};
  background-color: ${props => props.isEnable ? '#eef5ff' : '#acb2ba'};
  display: inline-block;
  font-size: 15px;
  width: 50px;
  height: calc(100% - 10px);
  text-align: center;
  line-height: 30px;
  margin-top: 5px;
  margin-left: 5px;
  border: 1px solid #919191;
  border-radius: 5px;
  &:hover {
    background-color:#b1bff5;
  }
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

// 案件ラベル選択時
const _SelectAnkenLabel = styled.div<{
    isSelect: boolean;
}>`
  display: ${props => props.isSelect ? 'block' : 'none'};
  background-color: #fcff4b9f;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
`;

// 案件ラベル(外枠)
const _AnkenLabel = styled.div<{
    ankenType: string;
}>`
  ${props => props.ankenType !== 'SE' ? '' : `background-color: #caccff;`}
  ${props => props.ankenType !== 'EE' ? '' : `background-color: #ffd2ca;`}
  ${props => props.ankenType !== 'PKG' ? '' : `background-color: #cdffca;`}
  display: inline-block;
  width: calc(100% - 10px);
  height: ${SystemUtil.ANKEN_LABEL_HEIGTH}px;
  margin-left: 5px;
  margin-top: 5px;
  font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
  font-weight: bold;
  position: relative;
  &:hover {
    opacity: 0.5;
  }
`;

// 案件ラベル(内側上部)
const _TopAnkenLabel = styled.div`
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  height: 50%;
`;

// 案件ラベル(内側下部)
const _BottomAnkenLabel = styled.div`
  display: inline-block;
  background-color: #f6f8ff;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  height: calc(50% - 3px);
  margin-bottom: 3px;
`;

// ステータス
const _Status = styled.span`
    color: #d80000;
`;
// 案件タイプ
const _AnkenType = styled.span`
    color: #68c05d;
`;
// カスタムID、大学名
const _Daigaku = styled.span`
    color: #0014af;
`;
// 開始日～終了日
const _Date = styled.span`
    color: #6e768a;
`;
// 案件番号
const _AnkenNo = styled.span`
    color: #a2a2a2;
`;
// 案件名
const _Title = styled.span`
    color: #000000;
`;
// []():
const _Other = styled.span`
    color: #9b9b9b;
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