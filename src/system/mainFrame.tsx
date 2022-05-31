import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import AnkenTab from './anken/ankenTab';
import KinouTab from './kinou/kinouTab';
import InputDialog from './utils/inputDialog';
import ConfirmDialog from './utils/confirmDialog';
import QueryUtil from './utils/queryUtil';
import DaigakuTab from './daigaku/daigakuTab';

namespace MainFrame {
    type GlobalContextProps = {
        setInputDialogProps: React.Dispatch<React.SetStateAction<InputDialog.Props | null>>;
        setConfirmDialogProps: React.Dispatch<React.SetStateAction<ConfirmDialog.Props | null>>;
        daigakuInfoList: DaigakuTab.DaigakuInfo[];
    }

    export const GlobalContext = createContext({} as GlobalContextProps);

    /**
     * メインフレーム
     * @returns メインフレームのJSX
     */
    export const Component = () => {
        // 画面遷移の管理(大学、案件)
        type Mode = 'daigaku' | 'anken' | 'kinou';
        // 画面遷移の管理
        const [mode, setMode] = useState<Mode>('daigaku');
        // inputダイアログを表示するか
        const [inputDialogProps, setInputDialogProps] = useState<null | InputDialog.Props>(null);
        // confirmダイアログを表示するか
        const [confirmDialogProps, setConfirmDialogProps] = useState<null | ConfirmDialog.Props>(null);
        // カスタムID、大学名
        const [daigakuInfoList, setDaigakuList] = useState<DaigakuTab.DaigakuInfo[]>([]);

        // カスタマID、大学名の取得
        useEffect(() => {
            QueryUtil.findDaigakuList().then(value => {
                setDaigakuList(value);
            });
        }, []);

        // 画面の状態を管理する
        let contentsJsx = <></>;

        // 画面切り替え
        switch (mode) {
            case 'daigaku':
                contentsJsx = <DaigakuTab.Component/>;
                break;
            case 'anken':
                contentsJsx = <AnkenTab.Component />;
                break;
            case 'kinou':
                contentsJsx = <KinouTab.Component/>;
                break;
        }

        return (
            <_Frame>
                <GlobalContext.Provider value={{ setInputDialogProps, setConfirmDialogProps, daigakuInfoList }}>
                    {inputDialogProps == null ? <></> : <InputDialog.Component formList={inputDialogProps.formList} heightSize={inputDialogProps.heightSize} execute={inputDialogProps.execute} />}
                    {confirmDialogProps == null ? <></> : <ConfirmDialog.Component cancelName={confirmDialogProps.cancelName} enterName={confirmDialogProps.enterName} message={confirmDialogProps.message} execute={confirmDialogProps.execute} />}
                    <_TabArea>
                        <_Tab isActive={mode === 'daigaku'} onClick={() => {
                            setMode('daigaku');
                        }} >大学</_Tab>
                        <_Tab isActive={mode === 'anken'} onClick={() => {
                            setMode('anken');
                        }} >案件</_Tab>
                        <_Tab isActive={mode === 'kinou'} onClick={() => {
                            setMode('kinou');
                        }} >機能</_Tab>
                    </_TabArea>
                    <_Contents>{contentsJsx}</_Contents>
                </GlobalContext.Provider>
            </_Frame>
        );
    }
};

export default MainFrame;

// フレーム
const _Frame = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
`;

// タブのエリア
const _TabArea = styled.div`
  background-color: #e2e6e8;
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
  display: inline-block;
  width: 100%;
  height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px);
`;

