import React, { useState } from 'react';
import styled from 'styled-components';
import SystemUtil from '../utils/systemUtil';
import QueryUtil from '../utils/queryUtil';

namespace DaigakuTab {
  export type DaigakuInfo = {
    // カスタムID
    customid: string;
    // 大学名
    daigakunam: string;
  }

  /**
   * 大学タブ
   * @returns 大学タブのJSX
   */
  export const Component = () => {
    // 大学名
    const [daigakuList, setDaigakuList] = useState<DaigakuInfo[]>([]);

    const daigakuJsxList: JSX.Element[] = [];

    daigakuList.forEach((value, i) => {
      const customId = daigakuList[i].customid;
      const daigakuName = daigakuList[i].daigakunam;
      daigakuJsxList.push(<_DaigakuLabel key={i}><_Other>[</_Other><_CustomId>{customId}</_CustomId><_Other>]: </_Other><_DaigakuName>{daigakuName}</_DaigakuName></_DaigakuLabel>);
    });

    return (
      <>
        <_Header><_DispButton onClick={() => {
          QueryUtil.findDaigakuList().then(value => {
            setDaigakuList(value);
          });
        }}>表示</_DispButton></_Header>
        <_Left>{daigakuJsxList}</_Left>
        <_Right></_Right>
      </>
    );
  }
};

export default DaigakuTab;

// ヘッダー
const _Header = styled.div`
  background-color: #dbdcfc;
  width: 100%;
  height: ${SystemUtil.KENSAKU_AREA_HEIGTH}px;
`;

// 表示ボタン
const _DispButton = styled.div`
  display: inline-block;
  background-color:#eef5ff;
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

// 画面左
const _Left = styled.div`
  background-color: #f0f0f0;
  display: inline-block;
  vertical-align: top;
  text-align: left;
  width: 50%;
  height: calc(100% - ${SystemUtil.KENSAKU_AREA_HEIGTH}px);
  overflow: auto;
  overflow-x: hidden;
`;

// 大学名ラベル
const _DaigakuLabel = styled.div`
  background-color: #ffcaca;
  display: inline-block;
  width: calc(100% - 10px);
  height: ${SystemUtil.DAIGAKU_LABEL_HEIGTH}px;
  margin-left: ${SystemUtil.MARGIN_SIZE}px;
  margin-top: ${SystemUtil.MARGIN_SIZE}px;
  font-size: ${SystemUtil.CONTENTS_CHAR_SIZE}px;
  font-weight: bold;
  &:hover {
        opacity: 0.5;
  }
`;

// カスタムID
const _CustomId = styled.span`
    color: #ac0000;
`;
// 大学名
const _DaigakuName = styled.span`
    color: #2e9e1f;
`;
// []:
const _Other = styled.span`
    color: #9b9b9b;
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