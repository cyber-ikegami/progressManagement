import React, { useContext, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import SystemUtil from '../utils/systemUtil';
import AnkenSyosai from './ankenSyosai';
import AnkenRireki from './ankenRireki';
import AnkenJisseki from './ankenJisseki';
import StylesUtil from '../utils/stylesUtil';
import AnkenChild from './ankenChild';
import QueryUtil from '../utils/queryUtil';
import InputDialog from '../utils/inputDialog';
import MainFrame from '../mainFrame';
import AnkenList from './ankenList';
import DialogUtil from '../utils/dialogUtil';

namespace AnkenTab {
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
        rirekiList: null | AnkenRireki.RirekiInfo[];
        // 実績リスト
        jissekiList: null | AnkenJisseki.JissekiInfo[];
    }

    // 画面遷移の管理(詳細、履歴、実績)
    export type AnkenMode = 'syosai' | 'rireki' | 'jisseki';

    // ソート順の管理(緊急度、日付、案件種別)
    type SortMode = 'kinkyu' | 'date' | 'ankenType';

    /**
     * 案件タブ
     * @returns 案件タブのJSX
     */
    export const Component = () => {
        // 案件のリスト
        const [ankenList, setAnkenList] = useState<AnkenInfo[]>([]);
        // 検索欄に入力された案件緊急度
        const [ankenStatus, setAnkenStatus] = useState<string>('9');
        // 現在選択している箇所
        const [focus, setFocus] = useState<number>(-1);
        // ロード(検索中)管理のフラグ
        const [isLoad, setIsLoad] = useState<boolean>(false);
        // 画面遷移の管理
        const [ankenMode, setAnkenMode] = useState<AnkenMode>('syosai');
        // ソート順の管理
        const [selectSortMode, setSelectSortMode] = useState<SortMode>('kinkyu');

        const { setInputDialogProps, setConfirmDialogProps, daigakuInfoList } = useContext(MainFrame.GlobalContext);

        // 画面切り替え
        let contentsJsx = <></>;
        switch (ankenMode) {
            case 'syosai':
                if (focus !== -1) {
                    contentsJsx = <AnkenSyosai.Component selectAnken={ankenList[focus]} />;
                }
                break;
            case 'rireki':
                contentsJsx = <AnkenRireki.Component
                    selectAnken={ankenList[focus]}
                    updateRireki={(rirekiList: AnkenRireki.RirekiInfo[]) => {
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
                contentsJsx = <AnkenJisseki.Component
                    selectAnken={ankenList[focus]}
                    updateJisseki={(jissekiList: AnkenJisseki.JissekiInfo[]) => {
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

        // 表示ボタン押下時の動作
        const dispAction = () => {
            setIsLoad(true);
            setAnkenMode('syosai');
            setFocus(-1);
            QueryUtil.findAnkenList(ankenStatus, '').then(value => {
                setAnkenList(value);
                setIsLoad(false);
            });
        };

        // 案件リスト並び替え
        useEffect(() => {
            // ソート前後のAnkenList比較
            const prev = JSON.stringify(ankenList);
            const sortList = sortAnkenList(ankenList, selectSortMode);
            const after = JSON.stringify(sortList);
            if (prev !== after) {
                setAnkenMode('syosai');
                setFocus(-1);
                setAnkenList(sortList.slice());
            }
        }, [ankenList, selectSortMode]);

        // フッター項目
        const footerJsx = <>
            <_Button isDisable={true} onClick={() => {
                // daigakuInfoListをOption[]の型に変更
                const daigakuOptionList: InputDialog.Option[] = daigakuInfoList.map((value) => {
                    const customId = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                    return { optionValue: value.customid, showValue: customId }
                });
                // 頭に空白追加
                daigakuOptionList.unshift({ optionValue: '', showValue: '' });

                // 案件追加
                setInputDialogProps(
                    DialogUtil.createAnkenDialog(daigakuOptionList, getSystemDate(), setAnkenMode, setFocus, setAnkenStatus, setAnkenList)
                );
            }}>追加</_Button>
            <_Button isDisable={focus !== -1} onClick={() => {
                // 頭に空白追加
                const comboBoxItemList = daigakuInfoList.slice();
                comboBoxItemList.unshift({ customid: '', daigakunam: '' });

                // daigakuInfoList(comboBoxItemList)をOption[]の型に変更
                const daigakuOptionList: InputDialog.Option[] = comboBoxItemList.map((value) => {
                    const itemValue = value.customid === '' ? '' : `${value.customid}：${value.daigakunam}`;
                    return { optionValue: value.customid, showValue: itemValue }
                });

                // 案件更新
                setInputDialogProps(
                    DialogUtil.updateAnkenDialog(ankenList, focus, daigakuOptionList, ankenStatus, setAnkenMode, setAnkenList)
                );
            }}>更新</_Button>
            <_Button isDisable={focus !== -1} onClick={() => {
                // 案件削除
                setConfirmDialogProps(
                    DialogUtil.deleteAnkenDialog(ankenList, focus, setAnkenMode, setFocus, setAnkenList)
                )
            }}>削除</_Button>
        </>;

        return (
            <>
                <_Header>
                    <_HeaderItem>
                        <_HeaderLabel>緊急度:</_HeaderLabel>
                        <input type="number" min='0' max='100' value={ankenStatus} onChange={(e) => {
                            setAnkenStatus(e.target.value);
                        }} />
                    </_HeaderItem>
                    <_HeaderItem>
                        <_HeaderLabel>ソート順:</_HeaderLabel>
                        <_RadioLabel>
                            <input type="radio" value="kinkyu" checked={selectSortMode === 'kinkyu'} onChange={() => {
                                setSelectSortMode('kinkyu');
                            }} />緊急度
                            <input type="radio" value="date" checked={selectSortMode === 'date'} onChange={() => {
                                setSelectSortMode('date');
                            }} />日付
                            <input type="radio" value="ankenType" checked={selectSortMode === 'ankenType'} onChange={() => {
                                setSelectSortMode('ankenType');
                            }} />案件タイプ
                        </_RadioLabel>
                    </_HeaderItem>
                    <_DispButton isEnable={0 <= Number(ankenStatus) && Number(ankenStatus) <= 100} onClick={() => {
                        dispAction();
                    }}>表示</_DispButton>
                </_Header>
                <_Left>
                    <_Frame>
                        {isLoad ? <_LoadLabel>NowLoding…</_LoadLabel> : <AnkenChild.Component detailJsx={<AnkenList ankenList={ankenList} focus={focus} setFocus={setFocus} />} footerJsx={footerJsx} />}
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

    /**
     * システム日付の取得
     * @returns システム日付(XXXX/XX/XX)
     */
    const getSystemDate = () => {
        let today = new Date();
        const year = ('0000' + today.getFullYear()).slice(-4);
        const month = ('00' + (today.getMonth() + 1)).slice(-2);
        const day = ('00' + today.getDate()).slice(-2);
        return year + '/' + month + '/' + day;
    };

    /**
     * 案件一覧並び替え
     * @param ankenList 案件一覧
     * @param sortMode ソート順
     * @returns 並び替え後の案件一覧
     */
    const sortAnkenList = (ankenList: AnkenInfo[], sortMode: string) => {
        // 緊急度
        if (sortMode === 'kinkyu') {
            return ankenList.sort((a, b) => {
                // 条件1：緊急度
                if (a.status !== b.status) {
                    return (a.status - b.status);
                }
                // 条件2：開始日
                if (a.start_dy !== b.start_dy) {
                    return (a.start_dy > b.start_dy ? -1 : 1);
                }
                return 0;
            })
            // 日付 
        } else if (sortMode === 'date') {
            return ankenList.sort((a, b) => {
                // 条件1：開始日
                if (a.start_dy !== b.start_dy) {
                    return (a.start_dy > b.start_dy ? -1 : 1);
                }
                // 条件2：緊急度
                if (a.status !== b.status) {
                    return (a.status - b.status);
                }
                return 0;
            })
            // 案件種別
        } else if (sortMode === 'ankenType') {
            return ankenList.sort((a, b) => {
                // 条件1：案件タイプ
                if (a.ankentype !== b.ankentype) {
                    return (a.ankentype > b.ankentype ? -1 : 1);
                }
                // 条件2：緊急度
                if (a.status !== b.status) {
                    return (a.status - b.status);
                }
                return 0;
            })
        } else {
            return ankenList;
        }
    }
};

export default AnkenTab;

// ヘッダー
const _Header = styled.div`
    background-color: #dbdcfc;
    display: inline-block;
    width: 100%;
    height: ${SystemUtil.KENSAKU_AREA_HEIGTH}px;
`;

// ヘッダーの項目
const _HeaderItem = styled.div`
    height: 100%;
    display: inline-block;
    margin-right: 20px;
    & input {
        font-size: ${SystemUtil.FONT_SIZE}px;
        height: ${SystemUtil.KENSAKU_JOKEN_TEXT_HEIGHT}px;
        margin-top: ${SystemUtil.MARGIN_SIZE}px;
        margin-left: ${SystemUtil.MARGIN_SIZE}px;
        box-sizing: border-box; 
    }    
`;

// ヘッダー項目名ラベル
const _HeaderLabel = styled.div`
    font-size: ${SystemUtil.FONT_SIZE}px;
    display: inline-block;
    font-weight: bold;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
`;

// ヘッダー項目名ラベル
const _RadioLabel = styled.div`
    font-size: ${SystemUtil.FONT_SIZE}px;
    display: inline-block;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
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
    font-size: ${SystemUtil.FONT_SIZE}px;
    width: 50px;
    height: calc(100% - 10px);
    text-align: center;
    line-height: 30px;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    border: 1px solid #919191;
    border-radius: 5px;
    &:hover {
        background-color:#b1bff5;
    }
`;

// フレーム
const _Frame = styled.div`
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    margin-bottom: ${SystemUtil.MARGIN_SIZE}px;
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

// 追加・更新・削除ボタン
const _Button = styled.div<{
    isDisable: boolean;
}>`
    // 非活性処理
    ${props => props.isDisable ? '' : StylesUtil.IS_DISABLE}
    background-color: #eef5ff;
    display: inline-block;
    font-size: ${SystemUtil.FONT_SIZE}px;
    width: 80px;
    height: calc(100% - 10px);
    text-align: center;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
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
    font-size: ${SystemUtil.FONT_SIZE}px;
    text-align: center;
    width: ${SystemUtil.TAB_WEDTH}px;
    height: ${SystemUtil.TAB_HEIGTH}px;
    margin-left: ${SystemUtil.MARGIN_SIZE}px;
    margin-top: ${SystemUtil.MARGIN_SIZE}px;
`;

// コンテンツのエリア
const _Contents = styled.div`
    background-color: #e8e8e8;
    width: 100%;
    display: inline-block;
    height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px);
    position: relative;
`;
