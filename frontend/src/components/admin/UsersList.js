import React, { Fragment, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allUsers, clearErrors } from "../../actions/userActions";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { Table, notification } from "antd";

const UsersList = ({ history }) => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, users } = useSelector((state) => state.allUsers);
  const { isDeleted } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(allUsers());

    if (error) {
      notification.error({ message: error });
      dispatch(clearErrors());
    }

    if (isDeleted) {
      notification.open({
        type: 'success',
        message: 'Xoá người dùng thành công!'
      })
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, alert, error, isDeleted, history]);

  const dataSource = useMemo(() => {
    if (!users) {
      return [];
    }

    return users.map((userr) => {
      return {
        id: userr._id,
        name: userr.name,
        email: userr.email,
        role: userr.role,
        status: userr.status,
      };
    });
  }, [users]);

  console.log(dataSource);

  return (
    <Fragment>
      <MetaData title={"All Users"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">Tất cả người dùng</h1>

            <Loader loading={loading} />

            <Table
              rowKey={'id'}
              columns={[
                {
                  title: "ID",
                  dataIndex: "id",
                },
                {
                  title: "Tên người dùng",
                  dataIndex: "name",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                },
                {
                  title: "Quyền",
                  dataIndex: "role",
                },
                {
                  title: "Trạng thái tài khoản    ",
                  dataIndex: "status",
                  render: (status, user) => {
                    let hoat_dong = "";
                    if (user.role === "look") {
                      user.role = "Đã bị khóa";
                    }
                    if (user.role === "user") {
                      user.role = "Người dùng";
                    }
                    if (user.role === "admin") {
                      user.role = "Quản trị";
                    }
                    if (user.role === "Người dùng" || "Quản trị") {
                      hoat_dong = "Hoạt động";
                    }

                    return String(user?.role).includes("Đã bị khóa") ? (
                      <p style={{ color: "red" }}>
                        <i class="bi bi-key-fill"></i> {user?.role}
                      </p>
                    ) : (
                      <p style={{ color: "green" }}>
                        <i class="bi bi-activity"></i> {hoat_dong}
                      </p>
                    );
                  },
                },
                {
                  title: "Hành động",
                  dataIndex: "id",
                  fixed: true,
                  width: 200,
                  render: (id) => (
                    <Fragment>
                      &emsp;
                      <Link
                        to={`/admin/user/${id}`}
                        className="btn btn-primary py-1 px-2"
                      >
                        <i className="fa fa-pencil"></i>
                      </Link>
                      &emsp;
                      <Link
                        to={`/admin/look_user/${id}`}
                        className="btn btn-danger py-1 px-2"
                      >
                        <i class="bi bi-key-fill"></i>
                      </Link>
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

export default UsersList;
