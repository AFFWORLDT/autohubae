import { useSearchParams } from 'react-router-dom';
import style from './MultiSelectAction.module.css';
import { useSelectedProperties } from '../context/SelectedPropertiesContext';
import useBrowserWidth from '../hooks/useBrowserWidth';
import Modal from './Modal';
import NewPropertyItemTagMultiSelectActions from '../features/properties/NewPropertyItemTagMultiSelectActions';
import NewPropertyItemAgentMultiSelectActions from '../features/properties/NewPropertyItemAgentMultiSelectActions';

function MultiSelectAction({ onClick, showCheckboxes }) {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status') ?? "ACTIVE";
    const { handleBulkAction, } = useSelectedProperties();
    const browserWidth = useBrowserWidth();
    return (
        <div className={style.container}>
            {showCheckboxes && (
                browserWidth > 480 ?
                    <div className={style.actionButtonContainer}>
                        <button
                            className={style.btn}
                            onClick={() =>
                                handleBulkAction(status.toString().trim() === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active')
                            }
                        >
                            {status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
                        </button>

                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnTag">
                                <button className={style.btn}>
                                    Tag
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnTag">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '300px' }}>
                                    <NewPropertyItemTagMultiSelectActions />
                                </div>

                            </Modal.Window>
                        </Modal>

                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnAgent">
                                <button className={style.btn}>
                                    Agent
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnAgent">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '300px' }}>
                                    <NewPropertyItemAgentMultiSelectActions/>
                                </div>

                            </Modal.Window>
                        </Modal>



                        <button className={style.btn} onClick={() => handleBulkAction('Delete')}>
                            Delete
                        </button>
                    </div>
                    : <>
                        <Modal>
                            <Modal.Open openWindowName="MultiSelectActionOnTag">
                                <button className={style.btn} style={{ marginRight: 10 }}>
                                    T
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectActionOnTag">
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                                    <NewPropertyItemTagMultiSelectActions />
                                </div>

                            </Modal.Window>
                        </Modal>
                        <Modal>
                            <Modal.Open openWindowName="MultiSelectAction">
                                <button className={style.btn} style={{ marginRight: 10 }}>
                                    F
                                </button>
                            </Modal.Open>
                            <Modal.Window name="MultiSelectAction">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                    <button
                                        className={style.btn}
                                        onClick={() =>
                                            handleBulkAction(status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active')
                                        }
                                        style={{ marginRight: 10 }}
                                    >
                                        {status === 'ACTIVE' ? 'Mark Inactive' : 'Mark Active'}
                                    </button>


                                    <button className={style.btn} onClick={() => handleBulkAction('Delete')}>
                                        Delete
                                    </button>
                                </div>
                            </Modal.Window>
                        </Modal>


                    </>
            )}

            <button className={style.btn} onClick={onClick}>Select</button>
        </div>
    );
}

export default MultiSelectAction;
