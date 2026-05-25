import React, { useState } from "react";
import styles from "./PhoneSimulator.module.css";

interface PhoneSimulatorProps {
  src: string;
}

/**
 * 高仿真 iPhone 15 Pro 手机预览仿真框组件
 * 在 PC 端展示 1:1 移动端排版和互动效果
 * @param props 组件属性
 * @returns React 组件
 */
const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ src }) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.simulatorWrapper}>
      {/* 炫彩苹果风格流光大背景 */}
      <div className={styles.auroraBackground}>
        <div className={`${styles.auroraBlob} ${styles.blob1}`}></div>
        <div className={`${styles.auroraBlob} ${styles.blob2}`}></div>
        <div className={`${styles.auroraBlob} ${styles.blob3}`}></div>
      </div>

      <div className={styles.simulatorContainer}>
        {/* iPhone 15 Pro 钛金属机身框架 */}
        <div className={styles.phoneBody}>
          {/* 左侧物理按键：静音/动作键 + 音量加 + 音量减 */}
          <div className={`${styles.physicalKey} ${styles.actionKey}`}></div>
          <div className={`${styles.physicalKey} ${styles.volumeUpKey}`}></div>
          <div className={`${styles.physicalKey} ${styles.volumeDownKey}`}></div>

          {/* 右侧物理按键：电源键 */}
          <div className={`${styles.physicalKey} ${styles.powerKey}`}></div>

          {/* 屏幕钢化膜/屏幕内侧高光边缘 */}
          <div className={styles.screenInnerBorder}>
            {/* 灵动岛 (Dynamic Island) */}
            <div className={styles.dynamicIsland}>
              <div className={styles.cameraCore}></div>
              <div className={styles.sensorCore}></div>
            </div>

            {/* 顶部隐藏式微缝听筒 */}
            <div className={styles.speakerGrill}></div>

            {/* iframe 视图载体 */}
            <div className={styles.screenArea}>
              {isLoading && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}></div>
                  <span className={styles.loadingText}>正在载入移动端视图...</span>
                </div>
              )}
              <iframe
                src={src}
                className={styles.phoneIframe}
                onLoad={handleLoad}
                title="iPhone 15 Pro 移动端适配预览"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>

            {/* 底部虚拟 Home 指示条 (Home Indicator) */}
            <div className={styles.homeIndicator}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneSimulator;
