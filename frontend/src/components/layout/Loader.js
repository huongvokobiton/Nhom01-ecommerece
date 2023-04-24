import React from "react";
import { Modal, Spin, Typography } from "antd";

const Loader = ({ loading = false }) => {
  return (
    <Modal
      open={loading}
      centered
      footer={null}
      title={"Loading Data"}
      closable={false}
      style={{ background: "transparent" }}
      modalRender={() => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin spinning={true} size="large" />
          <Typography.Text
            style={{ fontSize: "1rem", color: "white", marginLeft: "1rem" }}
          >
            Loading ...
          </Typography.Text>
        </div>
      )}
    />
  );
};

export default Loader;
