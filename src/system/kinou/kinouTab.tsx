import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import AbstractFunctionBuilder from '../function/abstractFunctionBuilder';
import DownloadEEJisseki from '../function/downloadEEJisseki';
import DownloadPKGJisseki from '../function/downloadPKGJisseki';
import DownloadSEJisseki from '../function/downloadSEJisseki';
import SystemUtil from '../utils/systemUtil';
import KinouInput from './KinouInput';

const KinouTab = () => {
    // 現在選択している箇所
    const [focus, setFocus] = useState<number>(-1);

    const kinouList: AbstractFunctionBuilder[] = useMemo(() => {
        return [new DownloadSEJisseki(), new DownloadEEJisseki(), new DownloadPKGJisseki()];
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
                <_RightTop>
                    <_Frame>
                        <KinouInput kinouList={kinouList} focus={focus} />
                    </_Frame>
                </_RightTop>
                <_RightBottom>
                    <_TextArea>
                        <textarea readOnly></textarea>
                    </_TextArea>
                </_RightBottom>
            </_Right>
        </>
    );
}

export default KinouTab;

// ヘッダー
const _Header = styled.div`
  background-color: #dbdcfc;
  width: 100%;
  height: ${SystemUtil.KENSAKU_AREA_HEIGTH}px;
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
  margin-left: 5px;
  margin-top: 5px;
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

// 画面右上
const _RightTop = styled.div`
  background-color: #e2e6e8;
  display: inline-block;
  margin-left: auto;
  text-align: left;
  width: 100%;
  height: 50%;
  overflow: auto;
  overflow-x: hidden;
  position: relative;
`;

// 画面右下
const _RightBottom = styled.div`
  background-color: #c0ceef;
  display: inline-block;
  margin-left: auto;
  text-align: left;
  width: 100%;
  height: 50%;
  overflow: auto;
  overflow-x: hidden;
`;

// テキストエリア
const _TextArea = styled.div`
  width: 100%;
  height: 100%;
    & textarea {
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      resize: none;
      margin-left: 5px;
      margin-top: 5px;
      box-sizing: border-box;
    }
`;