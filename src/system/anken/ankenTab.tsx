import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import SystemUtil from '../utils/systemUtil';
import { sendQueryRequestToAPI } from '../utils/dataBaseUtil';
import AnkenSyosai from './ankenSyosai';
import AnkenRireki from './ankenRireki';
import AnkenJisseki from './ankenJisseki';
import StylesUtil from '../utils/stylesUtil';
import AnkenChild from './ankenChild';
import { GlobalContext } from '../mainFrame';
import { Option } from '../utils/inputDialog';

export type AnkenInfo = {
    // 案件ID
    ankenid: number;
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
    ankenno: string;
    // 案件タイトル
    title: string;
    // 詳細
    detail: string;
    // 履歴リスト
    rirekiList: null | RirekiInfo[];
    // 実績リスト
    jissekiList: null | JissekiInfo[];
}

export type RirekiInfo = {
    // 履歴管理番号
    rirekiseq: number;
    // 状態
    state: string;
    // 備考
    detail: string;
}

export type JissekiInfo = {
    // 実績番号
    jisekiseq: number;
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
    // 案件のリスト
    const [ankenList, setAnkenList] = useState<AnkenInfo[]>([]);
    // 検索欄に入力された案件緊急度
    const [ankenStatus, setAnkenStatus] = useState<string>('');
    // 現在選択している箇所
    const [focus, setFocus] = useState<number>(-1);
    // ロード(検索中)管理のフラグ
    const [isLoad, setIsLoad] = useState<boolean>(false);
    // 画面遷移の管理
    const [ankenMode, setAnkenMode] = useState<AnkenMode>('syosai');

    const { setInputDialogProps, setConfirmDialogProps, daigakuInfoList } = useContext(GlobalContext);

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
                    <_Blue>{value.customid === '' ? '---' : `${value.customid}:${value.daigakunam}`}</_Blue>
                    <_Gray>): {value.start_dy}～{value.update_dy}</_Gray>
                </_TopAnkenLabel>
                <_BottomAnkenLabel>
                    <_Gray>{value.ankenno} ) </_Gray>
                    <_Black>{value.title}</_Black>
                </_BottomAnkenLabel>
            </_AnkenLabel>
        );
    }, [ankenList, focus]);

    // フッター項目
    const footerJsx = <>
        <_Button isDisable={true} onClick={() => {
            // daigakuInfoListをOption[]の型に変更
            const daigakuOptionList: Option[] = daigakuInfoList.map((value) => {
                const customId = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                return { optionValue: value.customid, showValue: customId }
            });
            // 頭に空白追加
            daigakuOptionList.unshift({ optionValue: '', showValue: '' });

            setInputDialogProps(
                {
                    formList: [
                        {
                            labelName: '案件種別', value: '', type: 'comboBox', optionList: [{ optionValue: '', showValue: '' },
                            { optionValue: 'SE', showValue: 'SE' }, { optionValue: 'EE', showValue: 'EE' }, { optionValue: 'PKG連絡票', showValue: 'PKG連絡票' }], isRequired: true
                        },
                        { labelName: 'カスタマID', value: '', type: 'comboBox', optionList: daigakuOptionList, isRequired: false },
                        { labelName: '案件番号', value: '', isRequired: false },
                        { labelName: '案件タイトル', value: '', isRequired: true },
                        { labelName: '発生日', value: getSystemDate(), isRequired: true },
                        { labelName: '詳細', value: '', type: 'textArea', isRequired: false }
                    ],
                    heightSize: SystemUtil.ANKEN_TUIKA_DIALOG_HEIGTH,
                    execute: (values) => {
                        findMaxAnkenId().then(value => {
                            const nextAnkenId = value[0].maxid + 1;
                            const selectCustomId = values[1] === '' ? '' : (values[1].split('：'))[0];
                            insertAnken(values, nextAnkenId, selectCustomId).then(() => {
                                findAnkenList('', nextAnkenId).then(value => {
                                    setAnkenList([]);
                                    setAnkenList(value);
                                });
                            });
                        });
                    }
                }
            );
        }}>追加</_Button>
        <_Button isDisable={focus !== -1} onClick={() => {
            // 頭に空白追加
            const comboBoxItemList = daigakuInfoList.slice();
            comboBoxItemList.unshift({ customid: '', daigakunam: '' });

            // daigakuInfoList(comboBoxItemList)をOption[]の型に変更
            const daigakuOptionList: Option[] = comboBoxItemList.map((value) => {
                const isEmpty = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                return { optionValue: value.customid, showValue: isEmpty }
            });

            setInputDialogProps(
                {
                    formList: [{
                        labelName: '案件種別', value: ankenList[focus].ankentype, type: 'comboBox', optionList: [{ optionValue: '', showValue: '' },
                        { optionValue: 'SE', showValue: 'SE' }, { optionValue: 'EE', showValue: 'EE' }, { optionValue: 'PKG連絡票', showValue: 'PKG連絡票' }], isRequired: true
                    },
                    { labelName: 'カスタマID', value: `${ankenList[focus].customid}：${ankenList[focus].daigakunam}`, type: 'comboBox', optionList: daigakuOptionList, isRequired: false },
                    { labelName: '案件番号', value: ankenList[focus].ankenno.toString(), isRequired: false },
                    { labelName: '案件タイトル', value: ankenList[focus].title, isRequired: true },
                    { labelName: '発生日', value: ankenList[focus].start_dy, isRequired: true },
                    { labelName: '詳細', value: ankenList[focus].detail, type: 'textArea', isRequired: false }],
                    heightSize: SystemUtil.ANKEN_TUIKA_DIALOG_HEIGTH,
                    execute: (values) => {
                        const selectCustomId = values[1] === '' ? '' : (values[1].split('：'))[0];
                        updateAnken(values, ankenList[focus].ankenid, selectCustomId).then(() => {
                            findAnkenList('', '').then(value => {
                                setAnkenList(value);
                            });
                        });
                    }
                }
            );
        }}>更新</_Button>
        <_Button isDisable={focus !== -1} onClick={() => {
            setConfirmDialogProps(
                {
                    cancelName: 'キャンセル',
                    enterName: '削除',
                    message: '削除しますか？',
                    execute: () => {
                        deleteJisseki(ankenList[focus].ankenid).then(() => {
                            deleteRireki(ankenList[focus].ankenid).then(() => {
                                deleteAnken(ankenList[focus].ankenid).then(() => {
                                    setFocus(-1);
                                    setAnkenList([]);
                                });
                            });
                        });
                    }
                }
            )
        }}>削除</_Button>
    </>;

    let contentsJsx = <></>;

    // 画面切り替え
    switch (ankenMode) {
        case 'syosai':
            if (focus !== -1) {
                contentsJsx = <AnkenSyosai selectAnken={ankenList[focus]} />;
            }
            break;
        case 'rireki':
            contentsJsx = <AnkenRireki
                selectAnken={ankenList[focus]}
                updateRireki={(rirekiList: RirekiInfo[]) => {
                    ankenList[focus].rirekiList = rirekiList;
                    setAnkenList(ankenList.slice());
                }}
                updateAnken={() => {
                    setAnkenList(ankenList.slice());
                }}
                focus={focus}
            />;
            break;
        case 'jisseki':
            contentsJsx = <AnkenJisseki
                selectAnken={ankenList[focus]}
                updateJisseki={(jissekiList: JissekiInfo[]) => {
                    ankenList[focus].jissekiList = jissekiList;
                    setAnkenList(ankenList.slice());
                }}
                updateAnken={() => {
                    setAnkenList(ankenList.slice());
                }}
                focus={focus}
            />;
            break;
    }

    return (
        <>
            <_Header>
                <input type="number" min='0' max='100' placeholder="条件(緊急度0～100)を入力" onChange={(e) => {
                    setAnkenStatus(e.target.value);
                }} />
                <_DispButton isEnable={0 <= Number(ankenStatus) && Number(ankenStatus) <= 100} onClick={() => {
                    setIsLoad(true);
                    findAnkenList(ankenStatus, '').then(value => {
                        setIsLoad(false);
                        setAnkenList(value);
                    });
                }}>表示</_DispButton>
            </_Header>
            <_Left>
                <_Frame>
                    {isLoad ? <_LoadLabel>NowLoding…</_LoadLabel> : <AnkenChild detailJsx={ankenJsxList} footerJsx={footerJsx}></AnkenChild>}
                </_Frame>
            </_Left>
            <_Right isDisable={focus !== -1}>
                <_Frame>
                    <_TabArea>
                        <_Tab isActive={ankenMode === 'syosai' && focus !== -1} onClick={() => {
                            setAnkenMode('syosai');
                        }} >詳細</_Tab>
                        <_Tab isActive={ankenMode === 'rireki'} onClick={() => {
                            setAnkenMode('rireki');
                        }} >履歴</_Tab>
                        <_Tab isActive={ankenMode === 'jisseki'} onClick={() => {
                            setAnkenMode('jisseki');
                        }} >実績</_Tab>
                    </_TabArea>
                    <_Contents>
                        <_Frame>{contentsJsx}</_Frame>
                    </_Contents>
                </_Frame>
            </_Right>
        </>
    );
}

// SQL(案件)取得
const findAnkenList = async (ankenStatus: string, maxAnkenId: string) => {
    // 条件が入力されていたらwhere句を追加
    let joken = '';
    if (ankenStatus != '') {
        joken = `where a.status <= '${ankenStatus}'`;
    } else if (maxAnkenId != '') {
        joken = `where a.ankenid = '${maxAnkenId}'`;
    }

    const response = await sendQueryRequestToAPI('select',
        `SELECT a.ankenid, a.status, a.ankentype, a.customid, d.daigakunam, a.start_dy, a.update_dy,
        a.ankenno, a.title, a.detail, null as jissekiList
        from anken a
        left outer join daigaku d
        on a.customid = d.customid
        ${joken}
        order by status`);
    const results = await response.json();
    return results as AnkenInfo[];
};

// 案件IDの最大値を取得
const findMaxAnkenId = async () => {
    const response = await sendQueryRequestToAPI('select',
        `SELECT max(ankenid) as maxid from anken`);
    const results = await response.json();
    return results;
};

// 追加
const insertAnken = async (values: string[], nextAnkenId: number, customId: string) => {
    await sendQueryRequestToAPI('update',
        `INSERT INTO anken values ('${nextAnkenId}', '${values[0]}', '${customId}', '${values[2]}', '${values[3]}', '${values[5]}', '0', '${values[4]}', '')`);
};

// 更新
const updateAnken = async (values: string[], ankenId: number, customId: string) => {
    await sendQueryRequestToAPI('update',
        `UPDATE anken SET ankentype = '${values[0]}', customid = '${customId}', ankenno = '${values[2]}', title = '${values[3]}', detail = '${values[5]}', start_dy = '${values[4]}' where ankenid = '${ankenId}'`);
};

// 案件テーブルの削除
const deleteAnken = async (ankenid: number) => {
    await sendQueryRequestToAPI('update',
        `DELETE from anken where ankenid = '${ankenid}'`);
}

// 履歴テーブルの削除
const deleteRireki = async (ankenid: number) => {
    await sendQueryRequestToAPI('update',
        `DELETE from rireki where ankenid = '${ankenid}'`);

}

// 実績テーブルの削除
const deleteJisseki = async (ankenid: number) => {
    await sendQueryRequestToAPI('update',
        `DELETE from jisseki where ankenid = '${ankenid}'`);
};

// システム日付の取得
const getSystemDate = () => {
    let today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return year + '/' + month + '/' + day;
};

export default AnkenTab;

// ヘッダー
const _Header = styled.div`
    background-color: #dbdcfc;
    display: inline-block;
    width: 100%;
    height: ${SystemUtil.KENSAKU_AREA_HEIGTH}px;
    & input {
        width: ${SystemUtil.KENSAKU_JOKEN_TEXT_WIDTH}px;
        height: ${SystemUtil.KENSAKU_JOKEN_TEXT_HEIGHT}px;
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
        background-color:#b1bff5;
    }
`;

// フレーム
const _Frame = styled.div`
    margin-top: 5px;
    margin-left: 5px;
    margin-bottom: 5px;
    border: 1px solid;
    border-color: #b1bff5;
    overflow: auto;
    overflow-x: hidden;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
`;

// 画面左
const _Left = styled.div`
    background-color: #f0f0f0;
    display: inline-block;
    vertical-align: top;
    text-align: left;
    width: 50%;
    height: calc(100% - ${SystemUtil.KENSAKU_AREA_HEIGTH}px);
`;

// NowLodingラベル
const _LoadLabel = styled.div`
    font-size: 20px;
    color: #d80000;    
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
    ${props => props.ankenType !== 'PKG連絡票' ? '' : `background-color: #bbefb9;`}
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
    background-color: #f6f8ff;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    height: calc(50% - 3px);
    margin-bottom: 3px;
`;

// 追加・更新・削除ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}
    background-color: #eef5ff;
    display: inline-block;
    font-size: 15px;
    width: 80px;
    height: calc(100% - 10px);
    text-align: center;
    margin-top: 5px;
    margin-left: 5px;
    border: 1px solid #919191;
    border-radius: 5px;
    &:hover {
        background-color:#b1bff5;
    }
`;

// 画面右
const _Right = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}

    background-color: #f0f0f0;
    display: inline-block;
    vertical-align: top;
    margin-left: auto;
    text-align: left;
    width: 50%;
    height: calc(100% - ${SystemUtil.KENSAKU_AREA_HEIGTH}px);
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
    height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px);
    position: relative;
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
