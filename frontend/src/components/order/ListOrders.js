import React, { Fragment, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { myOrders, clearErrors } from "../../actions/orderActions";
import { Table, notification } from 'antd'

const ListOrders = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, orders } = useSelector((state) => state.myOrders);

  useEffect(() => {
    dispatch(myOrders());

    if (error) {
      notification.error({ message: error });
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

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
      <MetaData title={"Đơn hàng của tôi"} />
      <h1 className="my-5 ml-3">Đơn hàng của tôi</h1>
      <Loader loading={loading} />
      <Table
        className="ml-3 mr-3"
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
                    to={`/order/${value}`}
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
  );
};

export default ListOrders;
