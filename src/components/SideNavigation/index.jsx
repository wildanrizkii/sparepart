"use client";
import React, { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
import { Poppins } from "next/font/google";
import dayjs from "dayjs";
import { signOut } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  UserOutlined,
  FileOutlined,
  DownSquareOutlined,
  LogoutOutlined,
  FundOutlined,
  UpSquareOutlined,
  ProductOutlined,
  BuildOutlined,
  FileTextOutlined,
  WalletOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  DownOutlined,
  BellOutlined,
  BellFilled,
  NotificationFilled,
  AppstoreOutlined,
  AppstoreAddOutlined,
  LayoutOutlined,
  BorderOuterOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Layout,
  Menu,
  Space,
  theme,
  Image,
  Dropdown,
  Tabs,
} from "antd";
import { redirect, useRouter } from "next/navigation";
import FloatingButton from "../FloatingButton/ScrollToTop";
import Link from "next/link";
import { useSession } from "next-auth/react";

const { Header, Sider, Content } = Layout;

const SideNavigation = ({ menu, submenu, konten }) => {
  dayjs.locale("id");
  const kemarin = dayjs().subtract(1, "day");
  const dateFormatted = kemarin.format("DD MMMM YYYY");

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isDot, setIsDot] = useState(false);
  const [tanggalKemarin, setTanggalKemarin] = useState(dateFormatted);
  const [fiturAnggaranCount, setFiturAnggaranCount] = useState(false);
  const [fiturTransaksi, setFiturTransaksi] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: session } = useSession();
  let key1 = { menu };
  let key2 = { submenu };

  // console.log(session?.user);

  useEffect(() => {
    document.body.classList.add("loaded");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCollapsed(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {true ? (
        <Layout style={{ minHeight: "100vh" }} className={poppins.variable}>
          <Sider
            collapsed={collapsed}
            // collapsible
            // onCollapse={toggleCollapsed}
            breakpoint="md"
            style={{
              padding: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              position: "sticky",
              top: 0,
              height: "100vh",
              overflow: "auto",
            }}
            width={"28vh"}
          >
            <Space
              align="center"
              direction="vertical"
              style={{ display: "flex" }}
              className="mt-8 mb-8"
            >
              <Image
                src="/images/logo-cmw.png"
                width={collapsed ? 60 : 180}
                height={collapsed ? 60 : 60}
                preview={false}
              />
            </Space>

            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[key1.menu]}
              defaultOpenKeys={[key2.submenu]}
              items={[
                {
                  key: "1",
                  icon: <LayoutOutlined style={{ fontSize: "22px" }} />,
                  label: "Daftar Part Induk",
                  onClick: () => router.push("/"),
                },
                {
                  key: "2",
                  icon: <SettingOutlined style={{ fontSize: "22px" }} />,
                  label: "Kelola Data",
                  children: [
                    {
                      key: "2-1",
                      icon: <AppstoreOutlined style={{ fontSize: "20px" }} />,
                      label: "Part Induk",
                      onClick: () => router.push("/kelola/partinduk"),
                    },
                    {
                      key: "2-2",
                      icon: (
                        <AppstoreAddOutlined style={{ fontSize: "20px" }} />
                      ),
                      label: "Part Anak",
                      onClick: () => router.push("/kelola/partanak"),
                    },
                    {
                      key: "2-3",
                      icon: <ProductOutlined style={{ fontSize: "20px" }} />,
                      label: "Material",
                      onClick: () => router.push("/kelola/material"),
                    },
                    {
                      key: "2-4",
                      icon: <BuildOutlined style={{ fontSize: "20px" }} />,
                      label: "DWG Supplier",
                      onClick: () => router.push("/kelola/dwg-supplier"),
                    },
                    {
                      key: "2-5",
                      icon: <BuildOutlined style={{ fontSize: "20px" }} />,
                      label: "Supplier Impor",
                      onClick: () => router.push("/kelola/supplier-impor"),
                    },
                    {
                      key: "2-6",
                      icon: <BuildOutlined style={{ fontSize: "20px" }} />,
                      label: "Supplier Lokal",
                      onClick: () => router.push("/kelola/supplier-lokal"),
                    },
                    {
                      key: "2-7",
                      icon: (
                        <BorderOuterOutlined style={{ fontSize: "20px" }} />
                      ),
                      label: "Maker",
                      onClick: () => router.push("/kelola/maker"),
                    },
                  ],
                },
                {
                  key: "3",
                  icon: <InfoCircleOutlined style={{ fontSize: "20px" }} />,
                  label: "About",
                  onClick: () => router.push("/about"),
                },
              ]}
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                backgroundColor: "transparent",
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleCollapsed}
                style={{
                  width: 64,
                  height: 64,
                }}
              />

              <Space
                direction="horizontal"
                size={16}
                className="float-right mr-8 mt-4"
              >
                <Dropdown
                  trigger={["click"]}
                  placement="bottomRight"
                  arrow
                  dropdownRender={() => {
                    return (
                      <Tabs
                        animated={true}
                        defaultActiveKey="1"
                        centered
                        tabBarStyle={{
                          backgroundColor: "white",
                          borderRadius: "6px 6px 0 0",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                          marginBottom: "0px",
                        }}
                        items={[
                          {
                            label: "Profil",
                            key: "1",
                            children: (
                              <div
                                className="cursor-default bg-white rounded-b-md p-6 shadow-md min-w-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex justify-center mb-4">
                                  {session?.user?.image ? (
                                    // <Avatar
                                    //   shape="square"
                                    //   size={{
                                    //     xs: "50px",
                                    //     sm: "60px",
                                    //     md: "70px",
                                    //     lg: "80px",
                                    //     xl: "90px",
                                    //     xxl: "100px",
                                    //   }}
                                    //   src={session.user.image}
                                    // />
                                    <Avatar
                                      shape="square"
                                      size="large"
                                      icon={<UserOutlined />}
                                    />
                                  ) : (
                                    <Avatar
                                      shape="square"
                                      size="large"
                                      icon={<UserOutlined />}
                                    />
                                  )}
                                </div>
                                <div className="grid gap-2">
                                  <div
                                    className="cursor-default"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <h1 className="font-bold">Nama</h1>
                                    <h1>
                                      {session?.user?.name
                                        ? session?.user?.name
                                        : "Loading..."}
                                    </h1>
                                  </div>

                                  <div
                                    className="cursor-default"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <h1 className="font-bold">Email</h1>
                                    <h1>
                                      {session?.user?.email
                                        ? session?.user?.email
                                        : "Loading..."}
                                    </h1>
                                  </div>

                                  <div className="flex gap-2 mt-2">
                                    {/* <Link
                                      href="/pengaturan/akun"
                                      className="flex-grow"
                                    >
                                      <div className="flex shadow-md justify-center items-center p-3 gap-1 border text-emerald-600 hover:text-white bg-transparent border-emerald-600 hover:bg-emerald-600 rounded-md cursor-pointer transition-colors h-full">
                                        <SettingOutlined />
                                        <h1 className="mb-0.5">
                                          Pengaturan Akun
                                        </h1>
                                      </div>
                                    </Link> */}
                                    <div
                                      className="flex shadow-md w-44 md:w-52 justify-center items-center p-4 gap-1 text-white bg-red-500 hover:bg-red-600 rounded-md cursor-pointer transition-colors"
                                      onClick={() => signOut()}
                                    >
                                      <LogoutOutlined className="mb-0.5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                          },
                          {
                            label: (
                              <Badge dot={isDot}>
                                <div
                                  className="mr-1"
                                  // onClick={() => setIsDot(false)}
                                >
                                  Notifikasi
                                </div>
                              </Badge>
                            ),
                            key: "2",
                            children: (
                              <div
                                className="cursor-default bg-white rounded-b-md p-6 shadow-md max-w-xs mx-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="grid gap-2">
                                  {notificationCount > 0 ? (
                                    <div className="flex rounded-lg bg-orange-600 mb-2 px-4 py-4 items-center justify-center gap-4 text-white shadow-md relative">
                                      <div className="grid text-sm gap-2">
                                        <div className="flex font-medium gap-1">
                                          <BellFilled />
                                          Pengingat
                                        </div>
                                        <div className="text-wrap mb-1">
                                          Pada tanggal {dateFormatted}, Anda
                                          belum melakukan pencatatan transaksi
                                          sama sekali, periksa kembali apakah
                                          ada transaksi yang belum tercatat?
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}

                                  {fiturAnggaranCount > 0 ? (
                                    <div className="flex rounded-lg bg-blue-500 mb-2 px-4 py-4 items-center justify-center gap-4 text-white shadow-md relative">
                                      <div className="grid text-sm gap-2">
                                        <div className="flex font-medium gap-1">
                                          <NotificationFilled />
                                          Fitur
                                        </div>
                                        <div className="text-wrap">
                                          Batasi pengeluaran mu menggunakan
                                          fitur Anggaran
                                        </div>
                                        <Link
                                          href={"/anggaran"}
                                          className="text-wrap mb-1 text-white hover:text-gray-200 underline"
                                        >
                                          Coba sekarang
                                        </Link>
                                      </div>
                                    </div>
                                  ) : null}

                                  {notificationCount == 0 &&
                                  fiturAnggaranCount == 0 ? (
                                    <div className="flex rounded-lg bg-transparent mb-2 h-52 py-4 items-center justify-center gap-4 text-black relative">
                                      <div className="grid text-sm gap-2">
                                        <div className="text-wrap px-7 md:px-11">
                                          Tidak ada notifikasi
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            ),
                          },
                        ]}
                      />
                    );
                  }}
                >
                  {session?.user ? (
                    <div className="flex items-center justify-center gap-3 cursor-pointer">
                      <div className="hidden sm:block lg:text-lg text-gray-700">
                        <h1>
                          {session?.user?.name ? session?.user?.name : "..."}
                        </h1>
                      </div>
                      {/* <Badge dot={isDot}>
                        <Avatar
                          shape="square"
                          size="large"
                          src={session.user.image}
                        />
                      </Badge> */}
                      <Badge dot={isDot}>
                        <Avatar
                          shape="square"
                          size="large"
                          icon={<UserOutlined />}
                          style={{ cursor: "pointer" }}
                        />
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 cursor-pointer">
                      <div className="hidden sm:block lg:text-lg text-gray-700">
                        <h1>
                          {session?.user?.name ? session?.user?.name : "..."}
                        </h1>
                      </div>
                      <Badge dot={isDot}>
                        <Avatar
                          shape="square"
                          size="large"
                          icon={<UserOutlined />}
                          style={{ cursor: "pointer" }}
                        />
                      </Badge>
                    </div>
                  )}
                </Dropdown>
              </Space>
            </Header>
            <Content
              style={{
                margin: "24px 16px",
                padding: 24,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                alignItems: "center",
              }}
            >
              <div className="w-full max-w-screen-xl">{konten}</div>
              <FloatingButton />
            </Content>

            {/* <Footer /> */}
          </Layout>
        </Layout>
      ) : (
        redirect("/login")
      )}
    </>
  );
};
export default SideNavigation;
