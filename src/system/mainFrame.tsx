import React, { useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import DaigakuTab from './daigakuTab';
import AnkenTabLeft from './ankenTab';

const MainFrame = () => {
    // 画面遷移の管理(大学、案件)
    type Mode = 'daigaku' | 'anken';
    // 画面遷移の管理
    const [mode, setMode] = useState<Mode>('daigaku');

    // 画面の状態を管理する
    let contentsJsx = <></>;

    // 画面切り替え
    switch (mode) {
        case 'daigaku':
            contentsJsx = <DaigakuTab></DaigakuTab>;
            break;
        case 'anken':
            contentsJsx = <AnkenTabLeft></AnkenTabLeft>;
            break;
    }

    return (
        <>
            <_TabArea>
                <_Tab isActive={mode === 'daigaku'} onClick={() => {
                    setMode('daigaku');
                }} >大学</_Tab>
                <_Tab isActive={mode === 'anken'} onClick={() => {
                    setMode('anken');
                }} >案件</_Tab>
            </_TabArea>
            <_Contents>{contentsJsx}</_Contents>
        </>
    );
}

export default MainFrame;

// タブのエリア
const _TabArea = styled.div`
  background-color: #e2e6e8;
  width: 100%;
  height: ${SystemUtil.TAB_AREA_HEIGTH}px;
`;

// タブ
const _Tab = styled.div<{
    isActive: boolean;
}>`
  cursor: pointer;
  background-color: ${props => props.isActive ? '#8b8ff8' : '#bcbefc'};
  font-size: ${SystemUtil.TAB_CHAR_SIZE}px;
  text-align: center;
  width: ${SystemUtil.TAB_WEDTH}px;
  height: ${SystemUtil.TAB_HEIGTH}px;
  margin-left: 5px;
  margin-top: 5px;
  display: inline-block;
`;

// コンテンツのエリア
const _Contents = styled.div`
  width: 100%;
  height: calc(100% - ${SystemUtil.TAB_AREA_HEIGTH}px};
`;

