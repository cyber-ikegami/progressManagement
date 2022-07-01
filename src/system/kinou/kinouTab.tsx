import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import AbstractFunctionBuilder from '../function/abstractFunctionBuilder';
import DownloadSEJisseki from '../function/downloadSEJisseki';
import DownloadEEJisseki from '../function/downloadEEJisseki';
import DownloadPKGJisseki from '../function/downloadPKGJisseki';
import SystemUtil from '../utils/systemUtil';
import KinouRight from './KinouRight';

namespace KinouTab {
  /**
   * 機能タブ
   * @returns 機能タブのJSX
   */
  export const Component = () => {
    // 現在選択している箇所
    const [focus, setFocus] = useState<number>(-1);

    const kinouList: AbstractFunctionBuilder.Component[] = useMemo(() => {
      return [new DownloadSEJisseki.Component(), new DownloadEEJisseki.Component(), new DownloadPKGJisseki.Component()];
    }, []);

    const kinouJsxList = kinouList.map((kinou, i) => {
      return (
        <_KinouLabel key={i} onClick={() => {
          setFocus(i);
        }}>
          <_SelectKinouLabel isSelect={focus === i} />
          <_KinouNameLabel>{kinou.getFunctionName()}</_KinouNameLabel>
        </_KinouLabel>
      );
    });

    return (
      <>
        <_Header />
        <_Left>
          <_Frame>{kinouJsxList}</_Frame>
        </_Left>
        <_Right>
          <KinouRight.Component selectKinouList={kinouList[focus]} focus={focus} />
        </_Right>
      </>
    );
  }
};
export default KinouTab;

// ヘッダー
const _Header = styled.div`
  background-color: #dbdcfc;
  width: 100%;
  height: ${SystemUtil.KENSAKU_AREA_HEIGTH}px;
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
  height: calc(100% - ${SystemUtil.KENSAKU_AREA_HEIGTH}px);
  width: 50%;
  overflow: auto;
  overflow-x: hidden;
`;

// 機能ラベル
const _KinouLabel = styled.div`
  background-color: #caddff;
  display: inline-block;
  position: relative;
  width: calc(100% - 10px);
  height: ${SystemUtil.KINOU_LABEL_HEIGTH}px;
  margin-left: ${SystemUtil.MARGIN_SIZE}px;
  margin-top: ${SystemUtil.MARGIN_SIZE}px;
  &:hover {
    opacity: 0.5;
  }
`;

// 機能名ラベル
const _KinouNameLabel = styled.div`
  width: 100%;
  height: 100%;
  font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
  font-weight: bold;
`;

// 機能名ラベル選択時
const _SelectKinouLabel = styled.div<{
  isSelect: boolean;
}>`
    display: ${props => props.isSelect ? 'inline-block' : 'none'};
    background-color: #fcff4b9f;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10;
`;

// 画面右
const _Right = styled.div`
  background-color: #e8e8e8;
  display: inline-block;
  margin-left: auto;
  text-align: left;
  width: 50%;
  height: calc(100% - ${SystemUtil.KENSAKU_AREA_HEIGTH}px);
  overflow: auto;
  overflow-x: hidden;
`;