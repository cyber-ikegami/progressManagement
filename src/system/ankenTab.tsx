import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import SystemUtil from './utils/systemUtil';
import { sendQueryRequestToAPI } from './utils/dataBaseUtil';
import AnkenSyosai from './ankenSyosai';
import AnkenJisseki from './ankenJisseki';

export type AnkenInfo = {
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
    // 実績リスト
    jissekiList: null | JissekiInfo[];
}

export type JissekiInfo = {
    // 作業日
    sagyou_dy: string;
    // 作業者
    user: string;
    // 作業種別
    worktype: string;
    // 時間(m)
    time: number;
}

// 画面遷移の管理(詳細、履歴、実績)
type AnkenMode = 'syosai' | 'rireki' | 'jisseki';

// 案件タブ
const AnkenTab = () => {
    const [ankenList, setAnkenList] = useState<AnkenInfo[]>([]);
    const [ankenStatus, setAnkenStatus] = useState<string>('');
    const [focus, setFocus] = useState<number>(-1);

    // 画面遷移の管理
    const [ankenMode, setAnkenMode] = useState<AnkenMode>('syosai');

    const ankenJsxList: JSX.Element[] = useMemo(() => {
        return ankenList.map((value, i) =>
            <_AnkenLabel key={i} ankenType={value.ankentype} onClick={() => {
                setFocus(i);
            }}>
                <_SelectAnkenLabel isSelect={focus === i} />
                <_TopAnkenLabel>
                    <_Red>{value.status}</_Red>
                    <_Gray> [</_Gray>
                    <_Green>{value.ankentype}</_Green>
                    <_Gray>](</_Gray>
                    <_Blue>{value.customid}:{value.daigakunam}</_Blue>
                    <_Gray>): {value.start_dy}～{value.update_dy}</_Gray>
                </_TopAnkenLabel>
                <_BottomAnkenLabel>
                    <_Gray>{value.ankenno} ) </_Gray>
                    <_Black>{value.title}</_Black>
                </_BottomAnkenLabel>
            </_AnkenLabel>
        );
    }, [ankenList, focus]);

    // 画面の状態を管理する
    let contentsJsx = <></>;

    // 画面切り替え
    switch (ankenMode) {
        case 'syosai':
            if (focus !== -1) {
                const selectAnken = ankenList[focus];
                contentsJsx = <AnkenSyosai selectAnken={selectAnken} />;
            }
            break;
        case 'rireki':
            contentsJsx = <textarea value={'履歴'} />;
            break;
        case 'jisseki':
                const selectAnken = ankenList[focus];
                contentsJsx = <AnkenJisseki selectAnken={selectAnken} setAnkenList={setAnkenList}/>;
            break;
    }

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
            <_Right>
                <_TabArea>
                    <_Tab isActive={ankenMode === 'syosai'} onClick={() => {
                        setAnkenMode('syosai');
                    }} >詳細</_Tab>
                    <_Tab isActive={ankenMode === 'rireki'} onClick={() => {
                        setAnkenMode('rireki');
                    }} >履歴</_Tab>
                    <_Tab isActive={ankenMode === 'jisseki'} onClick={() => {
                        setAnkenMode('jisseki');
                    }} >実績</_Tab>
                </_TabArea>
                <_Contents>{contentsJsx}</_Contents>
            </_Right>
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
        a.ankenno, a.title, a.detail
        from anken a
        inner join daigaku d
        on a.customid = d.customid
        ${joken}
        order by status`);
    const results = await response.json();
    return results as AnkenInfo[];
};

export default AnkenTab;

// ヘッダー
const _Header = styled.div`
            background-color: #dbdcfc;
            display: inline-block;
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
            pointer-events: auto;
            background-color: #eef5ff;

            // 非活性処理
            ${props => props.isEnable ? '' : css`
    pointer-events: none;
    background-color: #acb2ba;
  `}

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
                background - color:#b1bff5;
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
            display: ${props => props.isSelect ? 'inline-block' : 'none'};
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
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            height: 50%;
            `;

// 案件ラベル(内側下部)
const _BottomAnkenLabel = styled.div`
            background-color: #f6f8ff;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;
            height: calc(50% - 3px);
            margin-bottom: 3px;
            `;

// 画面右
const _Right = styled.div`
            display: inline-block;
            vertical-align: top;
            margin-left: auto;
            text-align: left;
            width: 50%;
            height: calc(100% - ${SystemUtil.HEADER_HEIGTH}px);
            `;

// タブのエリア
const _TabArea = styled.div`
            background-color: #acdfe9;
            display: inline-block;
            width: 100%;
            height: ${SystemUtil.TAB_AREA_HEIGTH}px;
            `;

// タブ
const _Tab = styled.div<{
    isActive: boolean;
}>`
            cursor: pointer;
            background-color: ${props => props.isActive ? '#8b8ff8' : '#bcbefc'};
            display: inline-block;
            font-size: ${SystemUtil.TAB_CHAR_SIZE}px;
            text-align: center;
            width: ${SystemUtil.TAB_WEDTH}px;
            height: ${SystemUtil.TAB_HEIGTH}px;
            margin-left: 5px;
            margin-top: 5px;
            `;

// コンテンツのエリア
const _Contents = styled.div`
            background-color: #e8e8e8;
            width: 100%;
            display: inline-block;
            height: calc(100% - ${SystemUtil.TAB_HEIGTH}px);
            position: relative;
            `;

// 実績ラベル
const _JissekiLabel = styled.div`
            background-color: #d6d1ac;
            display: inline-block;
            width: calc(100% - 10px);
            height: ${SystemUtil.JISSEKI_LABEL_HEIGTH}px;
            margin-left: 5px;
            margin-top: 5px;
            font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
            font-weight: bold;
            position: relative;
            &:hover {
                opacity: 0.5;
            }
            `;

// 赤文字(ステータス等)
const _Red = styled.span`
            color: #d80000;
            `;
// 緑文字(案件タイプ等)
const _Green = styled.span`
            color: #68c05d;
            `;
// 青文字(カスタムID、大学名等)
const _Blue = styled.span`
            color: #0014af;
            `;
// グレー文字(開始日～終了日等)
const _Gray = styled.span`
            color: #6e768a;
            `;
// 黒文字(案件名等)
const _Black = styled.span`
            color: #000000;
            `;
