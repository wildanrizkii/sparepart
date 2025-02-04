"use client";
import React, { useState, useEffect } from "react";
import supabase from "@/app/utils/db";
import { useRouter } from "next/navigation";
import {
  Tabs,
  Avatar,
  Card,
  Badge,
  Flex,
  Switch,
  Button,
  Progress,
  Col,
  DatePicker,
  Popconfirm,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Divider,
  List,
  Spin,
  Empty,
  Result,
  Table,
  notification,
} from "antd";
import {
  EditOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";

const PartInduk = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);

  const router = useRouter();
  const [form] = useForm();
  const [editForm] = Form.useForm();

  const onClose = () => {
    setOpen(false);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const suffix = (
    <SearchOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      width: 54,
      align: "center",
    },
    {
      title: "No Part Induk",
      dataIndex: "nomor_pi",
    },
    {
      title: "No Part Induk Update",
      dataIndex: "nomor_pi_update",
    },
  ];

  const fetchPartInduk = async () => {
    try {
      const { data, error } = await supabase.from("part_induk").select("*");
      const partindukData = data.map((row, index) => ({
        key: row.id_pi,
        no: index + 1 + ".",
        nomor_pi: row.no_part,
        nomor_pi_update: row.no_part_update,
      }));
      setInitialData(partindukData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value) {
      setFilteredData(initialData);
      return;
    }

    const filtered = initialData.filter((item) => {
      const nomorPi = (item.nomor_pi || "-").toString();
      const nomorPiUpdate = (item.nomor_pi_update || "-").toString();
      const searchValue = value.toString();

      return (
        nomorPi.toLowerCase().includes(searchValue.toLowerCase()) ||
        nomorPiUpdate.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(initialData);
    fetchPartInduk();
  }, []);

  useEffect(() => {
    setFilteredData(initialData);
  }, [initialData]);

  const handleSubmit = async (values) => {
    console.log(values);
    try {
      const { data, error } = await supabase.from("part_induk").insert([
        {
          id_pi: await supabase
            .from("part_induk")
            .select("id_pi", { count: "exact", head: true })
            .then((r) => r.count + 1),
          no_part: values.nopartinduk,
          no_part_update: values.nopartindukupdate,
        },
      ]);
      if (error) {
        console.error("Error inserting data:", error);
      } else {
        console.log("Insert successful:", data);
      }
      onClose();
      form.resetFields();

      if (error) {
        notification.error({
          message: "Error",
          description: "Terjadi kesalahan saat menambah part induk",
          placement: "top",
          duration: 3,
        });
      } else {
        notification.success({
          message: "Berhasil",
          description: "Part induk baru berhasil ditambahkan",
          placement: "top",
          duration: 5,
        });
      }
    } catch (error) {
      console.error("Error on submit data!");
      notification.error({
        message: "Error",
        description: "Terjadi kesalahan saat menambah part induk",
        placement: "top",
        duration: 3,
      });
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="max-w-screen-xl">
      <div className="grid gap-4">
        <Drawer
          // title="Buat Anggaran"
          width={720}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={<p className="text-lg font-bold">Tambah Part Induk</p>}
          footer={
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Space>
                <button
                  type="button"
                  onClick={onClose}
                  className="max-w-44 text-wrap rounded border border-emerald-600 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:text-white hover:bg-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => form.submit()}
                  type="button"
                  className="min-w-36 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
                >
                  Simpan
                </button>
              </Space>
            </div>
          }
        >
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartinduk"
                  label="Nomor Part Induk"
                  rules={[
                    {
                      required: true,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartinduk"
                    placeholder="Masukkan nomor part induk"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    required
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="nopartindukupdate"
                  label="Nomor Part Induk Update"
                  rules={[
                    {
                      required: false,
                      message: "Isi field ini terlebih dahulu!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    id="nopartindukupdate"
                    placeholder="Masukkan nomor part induk update"
                    style={{
                      minHeight: 39,
                    }}
                    className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                    // required
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <div className="grid gap-4">
          <h1 className="text-2xl font-medium col-span-1">Kelola Part Induk</h1>
          <div className="grid gap-4">
            <button
              onClick={showDrawer}
              type="submit"
              className="max-w-44 text-wrap rounded border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-transparent hover:text-emerald-600 focus:outline-none focus:ring active:text-emerald-500 transition-colors"
            >
              Tambah Part Induk
            </button>
          </div>
        </div>

        <div>
          <Input
            placeholder="Cari Nomor Part Induk"
            size="large"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            suffix={suffix}
          />
        </div>
        <Flex gap="middle" vertical>
          <Table
            //   rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredData}
            pagination={{
              position: ["bottomRight"],
              responsive: true,
            }}
            size="large"
            bordered={true}
            //   onRow={(record) => ({
            //     onClick: (e) => handleRowClick(e, record),
            //     style: { cursor: "pointer" },
            //   })}
            loading={loading}
          />
        </Flex>
      </div>
    </div>
  );
};

export default PartInduk;
