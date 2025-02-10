"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Image, Input, Form, Row, Col, notification } from "antd";
import {
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let { data: session } = useSession();

  const handleSubmit = async () => {
    try {
      if (username.length >= 4 && password.length >= 4) {
        const response = await signIn("credentials", {
          username: username,
          password: password,
          redirect: false,
        });

        if (response?.error) {
          notification.error({
            message: "Error",
            description: "Username atau password yang Anda masukan salah!",
            placement: "top",
            duration: 3,
          });
        }
      } else {
        notification.error({
          message: "Error",
          description: "Harap isi username dan password dengan benar!",
          placement: "top",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Error on routes", error);
    }
  };

  useEffect(() => {
    document.body.classList.add("loaded");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4 font-mono">
      {!session ? (
        <div className="w-full max-w-md">
          {/* Card container with glass effect */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Image
                src="/images/logo-cmw.png"
                width={240}
                height={80}
                preview={false}
              />

              {/* <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Welcome Back!
            </h2> */}
            </div>

            {/* Form */}
            <Form layout="vertical" onFinish={handleSubmit}>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="username"
                    label="Username"
                    rules={[
                      {
                        required: false,
                        message: "Isi field ini terlebih dahulu!",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      id="username"
                      placeholder="Username"
                      style={{
                        minHeight: 45,
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      prefix={
                        <span
                          style={{ fontSize: 18, width: 20, color: "#ababab" }}
                        >
                          <UserOutlined />
                        </span>
                      }
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: false,
                        message: "Isi field ini terlebih dahulu!",
                      },
                    ]}
                  >
                    <Input.Password
                      type="password"
                      id="password"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        minHeight: 45,
                      }}
                      className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                      prefix={
                        <span
                          style={{ fontSize: 18, width: 20, color: "#ababab" }}
                        >
                          <LockOutlined />
                        </span>
                      }
                      iconRender={(visible) =>
                        visible ? (
                          <EyeOutlined style={{ fontSize: 18 }} />
                        ) : (
                          <EyeInvisibleOutlined style={{ fontSize: 18 }} />
                        )
                      }
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Sign In
              </button>
            </Form>

            {/* <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign up now
            </button>
          </p> */}
          </div>
        </div>
      ) : (
        redirect("/")
      )}
    </div>
  );
};

export default Login;
