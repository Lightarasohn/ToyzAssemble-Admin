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
                justifyContent:"center"
            }}
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
                    justifyContent:"space-around"
                }}
                >
                    <Button danger onClick={() => {handleOk(record); setIsOpen([false, null])}}>Yes</Button>
                    <Button color="grey" onClick={() => setIsOpen([false, null])}>No</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ReusableDeleteModal;