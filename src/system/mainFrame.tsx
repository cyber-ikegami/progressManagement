import React, { createContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import DaigakuTab, { DaigakuInfo } from './daigaku/daigakuTab';
import AnkenTab from './anken/ankenTab';
import InputDialog, { InputDialogProps } from './utils/inputDialog';
import ConfirmDialog, { ConfirmDialogProps } from './utils/confirmDialog';
import { sendQueryRequestToAPI } from './utils/dataBaseUtil';

type GlobalContextProps = {
    setInputDialogProps: React.Dispatch<React.SetStateAction<InputDialogProps | null>>;
    setConfirmDialogProps: React.Dispatch<React.SetStateAction<ConfirmDialogProps | null>>;
    daigakuInfoList: DaigakuInfo[];
}

export const GlobalContext = createContext({} as GlobalContextProps);

const MainFrame = () => {
    // 画面遷移の管理(大学、案件)
    type Mode = 'daigaku' | 'anken';
    // 画面遷移の管理
    const [mode, setMode] = useState<Mode>('daigaku');
    // inputダイアログを表示するか
    const [inputDialogProps, setInputDialogProps] = useState<null | InputDialogProps>(null);
    // confirmダイアログを表示するか
    const [confirmDialogProps, setConfirmDialogProps] = useState<null | ConfirmDialogProps>(null);
    // カスタムID、大学名
    const [daigakuInfoList, setDaigakuList] = useState<DaigakuInfo[]>([]);

    // カスタマID、大学名の取得
    useEffect(() => {
        findDaigakuList().then(value => {
            setDaigakuList(value);
        });
    }, []);

    // 画面の状態を管理する
    let contentsJsx = <></>;

    // 画面切り替え
    switch (mode) {
        case 'daigaku':
            contentsJsx = <DaigakuTab></DaigakuTab>;
            break;
        case 'anken':
            contentsJsx = <AnkenTab></AnkenTab>;
            break;
    }

    return (
        <_Frame>
            <GlobalContext.Provider value={{ setInputDialogProps, setConfirmDialogProps, daigakuInfoList }}>
                {inputDialogProps == null ? <></> : <InputDialog formList={inputDialogProps.formList} heightSize={inputDialogProps.heightSize} execute={inputDialogProps.execute} />}
                {confirmDialogProps == null ? <></> : <ConfirmDialog cancelName={confirmDialogProps.cancelName} enterName={confirmDialogProps.enterName} message={confirmDialogProps.message} execute={confirmDialogProps.execute} />}
                <_TabArea>
                    <_Tab isActive={mode === 'daigaku'} onClick={() => {
                        setMode('daigaku');
                    }} >大学</_Tab>
                    <_Tab isActive={mode === 'anken'} onClick={() => {
                        setMode('anken');
                    }} >案件</_Tab>
                </_TabArea>
                <_Contents>{contentsJsx}</_Contents>
            </GlobalContext.Provider>
        </_Frame>
    );
}

// SQL(大学名)取得
export const findDaigakuList = async () => {
    const response = await sendQueryRequestToAPI('select', `SELECT customid, daigakunam from daigaku  order by customid`);
    const results = await response.json();
    return results as DaigakuInfo[];
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
  font-size: ${SystemUtil.TAB_CHAR_SIZE}px;
  text-align: center;
  width: ${SystemUtil.TAB_WEDTH}px;
  height: ${SystemUtil.TAB_HEIGTH}px;
  margin-left: 5px;
  margin-top: 5px;
`;

// コンテンツのエリア
const _Contents = styled.div`
  display: inline-block;
  width: 100%;
  height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px);
`;

