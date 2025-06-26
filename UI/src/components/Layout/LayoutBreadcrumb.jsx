import { Breadcrumb } from "antd";
import "./LayoutBreadcrumb.css";

const LayoutBreadcrumb = () => {
    return (
        <Breadcrumb
            items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
            style={{ margin: '16px 0' }}
          />
    )
}

export default LayoutBreadcrumb;