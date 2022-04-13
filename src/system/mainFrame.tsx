import React, { createContext, useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import DaigakuTab from './daigaku/daigakuTab';
import AnkenTab from './anken/ankenTab';
import InputDialog, { DialogProps } from './utils/inputDialog';

type GlobalContextProps = {
    setDialogProps: React.Dispatch<React.SetStateAction<DialogProps | null>>;
}

export const GlobalContext = createContext({} as GlobalContextProps);

const MainFrame = () => {
    // 画面遷移の管理(大学、案件)
    type Mode = 'daigaku' | 'anken';
    // 画面遷移の管理
    const [mode, setMode] = useState<Mode>('daigaku');
    // ダイアログを表示するか
    const [dialogProps, setDialogProps] = useState<null | DialogProps>(null
        // {
        //     formList: [{ labelName: 'ラベル1', value: '値1' }, { labelName: 'ラベル2', value: '値2' }, { labelName: 'ラベル3', value: '値3' }],
        //     execute: () => { alert('テスト') }
        // }
    );

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
            <GlobalContext.Provider value={{ setDialogProps }}>
                {dialogProps == null ? <></> : <InputDialog formList={dialogProps.formList} execute={dialogProps.execute} />}
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

