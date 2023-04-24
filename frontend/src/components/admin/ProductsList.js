import React, { Fragment, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getAdminProducts,
  deleteProduct,
  clearErrors,
} from "../../actions/productActions";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { Space, Table, notification } from "antd";

const ProductsList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector((state) => state.products);
  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(getAdminProducts());

    if (error) {
      notification.error({ message: error });
      dispatch(clearErrors());
    }

    if (deleteError) {
      notification.error({message: deleteError});
      dispatch(clearErrors());
    }

    if (isDeleted) {
      notification.open({
        type: 'success',
        message: 'Xoá sản phẩm thành công!'
      })
      history.push("/admin/products");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, deleteError, isDeleted, history]);

  const dataSource = useMemo(() => {
    if (!products) {
      return []
    }

    return products.map((product) => {
      return {
        id: product._id,
        name: product.name,
        price: `${product.price.toLocaleString()} VNĐ`,
        stock: product.stock,
      };
    });
  }, [products]);


  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  return (
    <Fragment>
      <MetaData title={"Tất cả sản phẩm"} />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10 pr-3" style={{}}>
          <Fragment>
            <Space
              style={{
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
                paddingRight: "1rem",
              }}
            >
              <h1 className="my-5">Tất cả sản phẩm</h1>
              <Link to="/admin/product">
                <button type="button" className="btn btn-primary">
                  Thêm sản phẩm mới
                </button>
              </Link>
            </Space>

            <Loader loading={loading} />
            <Table
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                },
                {
                  title: "Tên sản phẩm",
                  dataIndex: "name",
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                },
                {
                  title: "Số lượng còn lại",
                  dataIndex: "stock",
                },
                {
                  title: "Hành động",
                  dataIndex: "id",
                  fixed: true,
                  width: 120,
                  render: (id) => (
                    <Fragment>
                      <Link
                        to={`/admin/product/${id}`}
                        className="btn btn-primary py-1 px-2"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                      <button
                        className="btn btn-danger py-1 px-2 ml-2"
                        data-toggle="modal"
                        data-target="#exampleModal"
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      {/* model delete */}
                      <div>
                        <div
                          className="modal fade"
                          id="exampleModal"
                          tabIndex={-1}
                          role="dialog"
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="exampleModalLabel"
                                >
                                  Thông báo!
                                </h5>
                                <button
                                  type="button"
                                  className="close"
                                  data-dismiss="modal"
                                  aria-label="Close"
                                >
                                  <span aria-hidden="true">×</span>
                                </button>
                              </div>
                              <div class="modal-body">
                                Bạn có muốn xóa không
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  data-dismiss="modal"
                                >
                                  Hủy
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() =>
                                    deleteProductHandler(id)
                                  }
                                  data-dismiss="modal"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  ),
                },
              ]}
              dataSource={dataSource}
            />
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default ProductsList;
