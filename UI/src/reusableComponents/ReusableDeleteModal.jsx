import {Button, Modal} from "antd";
import { UserOutlined, WarningOutlined } from "@ant-design/icons";
const ReusableDeleteModal = ({
    isOpen,
    setIsOpen,
    handleOk,
    record
}) => {
    return(
        <Modal
        open={isOpen[0]}
        closable
        footer={false}
        centered
        >
            <div
            style={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                width: "100%",
                maxWidth: "400px",
                margin: "auto",
                padding: "16px"
            }}
            className="responsive-delete-modal"
            >
                <h1
                style={{
                    display:"flex",
                    justifyContent:"center",
                    alignContent:"center"
                }}
                >
                    <WarningOutlined 
                        style={{
                            color:"red",
                        }}
                        size={"large"}
                    />
                </h1>
                <span
                style={{
                    display:"flex",
                    justifyContent:"center",
                    alignContent:"center"
                }}
                >
                    Are you sure?
                </span>
                <div
                style={{
                    display:"flex",
                    flexDirection:"row",
                    alignContent:"center",
                    justifyContent:"space-around",
                    gap: "12px",
                    marginTop: "16px"
                }}
                className="responsive-delete-modal-actions"
                >
                    <Button danger onClick={() => {handleOk(record); setIsOpen([false, null])}} style={{minWidth:"100px"}} block>
                        Yes
                    </Button>
                    <Button onClick={() => setIsOpen([false, null])} style={{minWidth:"100px"}} block>
                        No
                    </Button>
                </div>
            </div>
            {/* Responsive CSS */}
            <style>
                {`
                @media (max-width: 900px) {
                    .responsive-delete-modal {
                        max-width: 98vw !important;
                        padding: 12px !important;
                    }
                    .responsive-delete-modal-actions {
                        flex-direction: column !important;
                        gap: 10px !important;
                    }
                    .responsive-delete-modal .ant-btn {
                        width: 100% !important;
                        min-width: 80px !important;
                    }
                }
                @media (max-width: 600px) {
                    .responsive-delete-modal {
                        max-width: 99vw !important;
                        padding: 8px !important;
                    }
                    .responsive-delete-modal-actions {
                        flex-direction: column !important;
                        gap: 8px !important;
                    }
                    .responsive-delete-modal .ant-btn {
                        width: 100% !important;
                        min-width: 60px !important;
                        font-size: 13px !important;
                    }
                }
                @media (max-width: 420px) {
                    .responsive-delete-modal .ant-btn {
                        min-width: 40px !important;
                        font-size: 11px !important;
                    }
                }
                `}
            </style>
        </Modal>
    );
};

export default ReusableDeleteModal;