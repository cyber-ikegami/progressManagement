import React, { useState } from 'react';
import styled from 'styled-components';
import SystemUtil from './utils/systemUtil';
import DaigakuTab from './daigakuTab';
import AnkenTab from './ankenTab';

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
      contentsJsx = <AnkenTab></AnkenTab>;
    break;
  }

  return (
    <>
      <_Tab>
        <_ModeItem isActive={mode === 'daigaku'} onClick={() => {
          setMode('daigaku');
        }} >大学</_ModeItem>
        <_ModeItem isActive={mode === 'anken'} onClick={() => {
          setMode('anken');
        }} >案件</_ModeItem>
      </_Tab>
      <_Contents>{contentsJsx}</_Contents>
    </>
  );
}

export default MainFrame;

// タブのエリア
const _Tab = styled.div`
  background-color: #acdfe9;
  width: 100%;
  height: ${SystemUtil.TAB_AREA_HEIGTH}px;
`;

// 状態を示すラベル
const _ModeItem = styled.div<{
  isActive: boolean;
}>`
  cursor: pointer;
  background-color: ${props => props.isActive ? '#58e85c' : '#9fe6a1'};
  font-size: ${SystemUtil.TAB_FONT_SIZE}px;
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

