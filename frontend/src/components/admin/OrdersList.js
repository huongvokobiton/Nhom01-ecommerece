import React, { Fragment, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allOrders, clearErrors } from "../../actions/orderActions";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import { Table, notification } from "antd";

const OrdersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.allOrders);
  const { isDeleted } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(allOrders());

    if (error) {
      notification.error({ message: error });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      notification.open({
        type: "success",
        message: "Xóa hóa đơn thành công!",
      });
      history.push("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isDeleted, history]);

  const dataSource = useMemo(() => {
    if (!orders) {
      return [];
    }

    console.log(orders);
    return (
      orders?.map((order) => {
        console.log(order);
        return {
          id: order._id,
          numofItems: order.orderItems.length,
          amount: `${order.totalPrice} VNĐ`,
          createdAt: order.createdAt,
          status: order.orderStatus,
        };
      }) || []
    );
  }, [orders]);

  return (
    <Fragment>
      <MetaData title={"All Orders"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">Tất cả đơn hàng</h1>
            <Loader loading={loading} />
            <Table
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                },
                {
                  title: "Số mặt hàng",
                  dataIndex: "numofItems",
                },
                {
                  title: "Tổng tiền",
                  dataIndex: "amount",
                },
                {
                  title: "Ngày tạo hóa đơn",
                  dataIndex: "createdAt",
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  render: (status) => {
                    return (
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        {String(status).includes("Đã giao hàng") ? (
                          <span style={{ color: "green" }}>{status}</span>
                        ) : (
                          <span style={{ color: "red" }}>{status}</span>
                        )}
                      </div>
                    );
                  },
                },
                {
                  title: "Hành động",
                  dataIndex: "id",
                  fixed: true,
                  render: (value) => {
                    return (
                      <Fragment>
                        &emsp;&emsp;&emsp;&emsp;
                        <Link
                          to={`/admin/order/${value}`}
                          className="btn btn-primary py-1 px-2"
                        >
                          <i className="fa fa-eye"></i>
                        </Link>
                      </Fragment>
                    );
                  },
                },
              ]}
              rowKey={(order) => order?.id}
              dataSource={loading ? [] : dataSource}
              pagination={{
                total: orders?.length || 0,
              }}
            />
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default OrdersList;
