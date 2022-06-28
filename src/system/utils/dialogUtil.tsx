import AnkenJisseki from "../anken/ankenJisseki";
import AnkenTab from "../anken/ankenTab";
import ConfirmDialog from "./confirmDialog";
import InputDialog from "./inputDialog";
import QueryUtil from "./queryUtil";
import SystemUtil from "./systemUtil";

namespace DialogUtil {
    ////////////////////////////////////////
    // 入力ダイアログ
    ////////////////////////////////////////

    /**
     * 案件追加ダイアログ
     * @param daigakuOptionList 
     * @param systemDate 
     * @param setAnkenMode 
     * @param setFocus 
     * @param setAnkenStatus 
     * @param setAnkenList 
     * @returns 
     */
    export const createAnkenDialog = (
        daigakuOptionList: InputDialog.Option[],
        systemDate: string,
        setAnkenMode: React.Dispatch<React.SetStateAction<AnkenTab.AnkenMode>>,
        setFocus: React.Dispatch<React.SetStateAction<number>>,
        setAnkenStatus: React.Dispatch<React.SetStateAction<string>>,
        setAnkenList: React.Dispatch<React.SetStateAction<AnkenTab.AnkenInfo[]>>
    ): InputDialog.Props => {
        return {
            formList: [
                {
                    labelName: '案件種別', value: '', type: 'comboBox', optionList: [{ optionValue: '', showValue: '' },
                    { optionValue: 'SE', showValue: 'SE' }, { optionValue: 'EE', showValue: 'EE' }, { optionValue: 'PKG連絡票', showValue: 'PKG連絡票' }], isRequired: true
                },
                { labelName: 'カスタマID', value: '', type: 'comboBox', optionList: daigakuOptionList, isRequired: false },
                { labelName: '案件番号', value: '', isRequired: false },
                { labelName: '案件タイトル', value: '', isRequired: true },
                { labelName: '発生日', value: systemDate, isRequired: true },
                { labelName: '詳細', value: '', type: 'textArea', isRequired: false }
            ],
            heightSize: SystemUtil.ANKEN_TUIKA_DIALOG_HEIGTH,
            execute: (values) => {
                QueryUtil.findMaxAnkenId().then(value => {
                    const nextAnkenId = value[0].maxid + 1;
                    const selectCustomId = values[1] === '' ? '' : (values[1].split('：'))[0];
                    QueryUtil.insertAnken(values[0], values[2], values[3], values[4], values[5], nextAnkenId, selectCustomId).then(() => {
                        QueryUtil.findAnkenList('', nextAnkenId).then(value => {
                            setAnkenMode('syosai');
                            setFocus(-1);
                            setAnkenStatus('9');
                            setAnkenList([]);
                            setAnkenList(value);
                        });
                    });
                });
            }
        }
    };

    /**
     * 案件更新ダイアログ
     * @param ankenList 
     * @param focus 
     * @param daigakuOptionList 
     * @param ankenStatus 
     * @param setAnkenMode 
     * @param setAnkenList 
     * @returns 
     */
    export const updateAnkenDialog = (
        ankenList: AnkenTab.AnkenInfo[],
        focus: number,
        daigakuOptionList: InputDialog.Option[],
        ankenStatus: string,
        setAnkenMode: React.Dispatch<React.SetStateAction<AnkenTab.AnkenMode>>,
        setAnkenList: React.Dispatch<React.SetStateAction<AnkenTab.AnkenInfo[]>>
    ): InputDialog.Props => {
        return {
            formList: [{
                labelName: '案件種別', value: ankenList[focus].ankentype, type: 'comboBox', optionList: [{ optionValue: '', showValue: '' },
                { optionValue: 'SE', showValue: 'SE' }, { optionValue: 'EE', showValue: 'EE' }, { optionValue: 'PKG連絡票', showValue: 'PKG連絡票' }], isRequired: true
            },
            { labelName: 'カスタマID', value: `${ankenList[focus].customid}`, type: 'comboBox', optionList: daigakuOptionList, isRequired: false },
            { labelName: '案件番号', value: ankenList[focus].ankenno.toString(), isRequired: false },
            { labelName: '案件タイトル', value: ankenList[focus].title, isRequired: true },
            { labelName: '発生日', value: ankenList[focus].start_dy, isRequired: true },
            { labelName: '詳細', value: ankenList[focus].detail == null ? '' : ankenList[focus].detail, type: 'textArea', isRequired: false }],
            heightSize: SystemUtil.ANKEN_TUIKA_DIALOG_HEIGTH,
            execute: (values) => {
                const selectCustomId = values[1] === '' ? '' : (values[1].split('：'))[0];
                QueryUtil.updateAnken(values[0], values[2], values[3], values[4], values[5], ankenList[focus].ankenid, selectCustomId).then(() => {
                    QueryUtil.findAnkenList(ankenStatus, '').then(value => {
                        setAnkenMode('syosai');
                        setAnkenList(value);
                    });
                });
            }
        }
    }

    /**
     * 履歴追加ダイアログ
     * @param selectAnken 
     * @param systemDate 
     * @param updateAnken 
     * @returns 
     */
    export const createRirekiDialog = (
        selectAnken: AnkenTab.AnkenInfo,
        systemDate: string,
        updateAnken: () => void
    ): InputDialog.Props => {
        return {
            formList: [{ labelName: '状態', value: '' }, { labelName: '備考', value: '' }, { labelName: '緊急度', value: '0', type: 'number' }],
            heightSize: SystemUtil.ANKEN_RIREKI_TUIKA_DIALOG_HEIGTH,
            execute: (values) => {
                QueryUtil.findMaxRirekiseq(selectAnken.ankenid).then(value => {
                    const nextRirekiseq = value[0].maxSeq == null ? '0' : value[0].maxSeq + 1;

                    // 排他制御
                    if (selectAnken.rirekiList != null ? value[0].maxSeq === selectAnken.rirekiList[0].rirekiseq : value[0].maxSeq == null) {
                        QueryUtil.insertRireki(selectAnken.ankenid, values[0], values[1], nextRirekiseq).then(() => {
                            QueryUtil.updateAnkenStatus(selectAnken.ankenid, values[2], systemDate);
                            selectAnken.rirekiList = null;
                            selectAnken.status = Number(values[2]);
                            selectAnken.update_dy = systemDate;
                            updateAnken();
                        })
                    } else {
                        alert('最新の状態で再度実行してください！');
                    }
                });
            }
        }
    }

    /**
     * 実績追加ダイアログ
     * @param systemDate 
     * @param selectAnken 
     * @param sagyouKubunOptionList 
     * @param updateAnken 
     * @returns 
     */
    export const createJissekiDialog = (
        systemDate: string,
        selectAnken: AnkenTab.AnkenInfo,
        sagyouKubunOptionList: InputDialog.Option[],
        updateAnken: () => void
    ): InputDialog.Props => {
        return {
            formList: [
                { labelName: '作業日', value: systemDate, isRequired: true },
                { labelName: '作業者', value: '', type: 'comboBox', optionList: [{ optionValue: '', showValue: '' }, { optionValue: '河野', showValue: '河野' }, { optionValue: '村田', showValue: '村田' }, { optionValue: '池上', showValue: '池上' }], isRequired: true },
                { labelName: '作業種別', value: '', type: 'comboBox', optionList: sagyouKubunOptionList, isRequired: true },
                { labelName: '時間(m)', value: '', type: 'number', isRequired: true }
            ],
            heightSize: SystemUtil.ANKEN_JISSEKI_TUIKA_DIALOG_HEIGTH,
            execute: (values) => {
                QueryUtil.findMaxJisekiseq(selectAnken.ankenid).then(value => {
                    const nextJisekiseq = value[0].maxSeq == null ? '0' : value[0].maxSeq + 1;
                    QueryUtil.insertJisseki(selectAnken.ankenid, values[0], values[1], values[2], values[3], nextJisekiseq).then(() => {
                        selectAnken.jissekiList = null;
                        updateAnken();
                    });
                });
            }
        }
    }

    ////////////////////////////////////////
    // 確認ダイアログ
    ////////////////////////////////////////

    /**
     * 案件削除ダイアログ
     * @param ankenList 
     * @param focus 
     * @param setAnkenMode 
     * @param setFocus 
     * @param setAnkenList 
     * @returns 
     */
    export const deleteAnkenDialog = (
        ankenList: AnkenTab.AnkenInfo[],
        focus: number,
        setAnkenMode: React.Dispatch<React.SetStateAction<AnkenTab.AnkenMode>>,
        setFocus: React.Dispatch<React.SetStateAction<number>>,
        setAnkenList: React.Dispatch<React.SetStateAction<AnkenTab.AnkenInfo[]>>
    ): ConfirmDialog.Props => {
        return {
            cancelName: 'キャンセル',
            enterName: '削除',
            message: '削除しますか？',
            execute: () => {
                QueryUtil.deleteAnkenJisseki(ankenList[focus].ankenid).then(() => {
                    QueryUtil.deleteRireki(ankenList[focus].ankenid).then(() => {
                        QueryUtil.deleteAnken(ankenList[focus].ankenid).then(() => {
                            setAnkenMode('syosai');
                            setFocus(-1);
                            setAnkenList([]);
                        });
                    });
                });
            }
        }
    }

    /**
     * 実績削除ダイアログ
     * @param selectAnken 
     * @param focus 
     * @returns 
     */
    export const deleteJissekiDialog = (
        selectAnken: AnkenTab.AnkenInfo,
        focus: number
    ): ConfirmDialog.Props => {
        return {
            cancelName: 'キャンセル',
            enterName: '削除',
            message: '削除しますか？',
            execute: () => {
                const jissekiList = selectAnken.jissekiList as AnkenJisseki.JissekiInfo[];
                QueryUtil.deleteJisseki(selectAnken.ankenid, jissekiList[focus].jisekiseq);
                selectAnken.jissekiList = null;
            }
        }
    }
};

export default DialogUtil;