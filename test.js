/* eslint-disable */
import styles from './style.scss';
import React, { useEffect, useState, useRef } from 'react';
import classBind from 'classnames/bind';
import { isApp, hasLogin, gioEmit, ENV } from 'common/util';
import { nanoid } from 'nanoid';
import {getAnswerSheet, getProblemFeedback, getUserInfo} from 'model/practice';
import AnswerQuestionModal from 'pages/BrushQuestion/components/AnswerQuestionModal';
import {Toast} from "antd-mobile";
import {useHistory} from "react-router-dom";
const cx = classBind.bind(styles);
const mainBg = require('./img/mainBg.png');
const img1 = require('./img/1.png');
const img2 = require('./img/2.png');
const img3 = require('./img/3.png');
const img4 = require('./img/4.png');
const img5 = require('./img/5.png');
const img6 = require('./img/6.png');
const img7 = require('./img/7.png');
const Practice = function (props) {
    
    const [isLogin, setIsLogin] = useState(hasLogin());
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [flashcardSetId, setFlashcardSetId] = useState(1);
    const history = useHistory();
    
    useEffect(() => {
        const getUserData = async () => {
            let [err,res] = await getUserInfo();
            console.log('1111',res);
            sessionStorage.setItem('GIO_F', res.keyId);
            localStorage.setItem('user_name', res.keyName);
            localStorage.setItem('user_img', res.headPicUrl);
        }
        getUserData()
    }, []);
    const handleImg3Click = (e) => {
        gioEmit('ztjx_xcx_practice_home', {
            event_name: '真题解析_练背_首页按钮点击',
            button_name: '我有话说'
        });
        e.stopPropagation();
        setModalVisible(true);
    };
    
    const handleCloseModal = () => {
        setModalVisible(false);
    };
    
    
    // 一键催更点击事件
    const handleGetMore = () => {
        Toast.show({
            content: '收到，在努力写代码了'
        });
    };
    
    
    
    const [floaters, setFloaters] = useState([]);
    const bgRef = useRef(null);
    const imgRefs = useRef([]);
    const loadedCount = useRef(0);
    const physics = useRef({ anchors: [], sizes: [], vels: [], offsets: [], rafId: null, lastTs: 0 });
    
    const FLOAT_DURATION = 1600; // ms
    
    const handleQuanClick = (e) => {
        const target = e.target;
        if (!bgRef.current) return;
        // 只响应点击图片
        if (!(target && target.tagName && target.tagName.toLowerCase() === 'img')) return;
        
        // 查找被点击图片的索引
        const clickedIndex = imgRefs.current.findIndex(img => img === target);
        if (clickedIndex !== -1) {
            console.log('点击的图片索引:', clickedIndex);
            let button_name = '气泡';
            switch (clickedIndex) {
                case 0:
                    button_name = '记忆加速器';
                    break;
                case 1:
                    button_name = '闪卡记忆';
                    break;
                case 2:
                    button_name = '我有话说';
                    break;
                case 3:
                    button_name = '点赞';
                    break;
                case 4:
                    button_name = '考前冲刺';
                    break;
                case 5:
                    button_name = '每日十五分钟';
                    break;
                case 6:
                    button_name = '时政拿下';
                    break;
            }
            gioEmit('ztjx_xcx_practice_home', {
                event_name: '真题解析_练背_首页按钮点击',
                button_name
            });
        }
        
        const bgRect = bgRef.current.getBoundingClientRect();
        const rect = target.getBoundingClientRect();
        // 起点：图片顶部居中稍上方
        const startX = rect.left - bgRect.left + rect.width / 2;
        const startY = rect.top - bgRect.top - 8; // 往上偏移一点
        
        const id = nanoid();
        const createdAt = Date.now();
        const item = { id, x: startX, y: startY, createdAt };
        setFloaters((prev) => [...prev, item]);
        
        // 动画结束后移除
        setTimeout(() => {
            setFloaters((curr) => curr.filter((f) => f.id !== id));
        }, FLOAT_DURATION);
    };
    
    const handleImgLoad = () => {
        loadedCount.current += 1;
        if (loadedCount.current === 7) {
            initPhysics();
        }
    };
    
    const initPhysics = () => {
        const p = physics.current;
        const layerRect = bgRef.current.getBoundingClientRect();
        p.anchors = [];
        p.sizes = [];
        p.vels = [];
        p.offsets = [];
        
        imgRefs.current.forEach((el, i) => {
            if (!el) return;
            const r = el.getBoundingClientRect();
            const anchorX = r.left - layerRect.left;
            const anchorY = r.top - layerRect.top;
            p.anchors[i] = { x: anchorX, y: anchorY };
            p.sizes[i] = { w: r.width, h: r.height, r: Math.min(r.width, r.height) / 2 };
            p.offsets[i] = { x: 0, y: 0 };
            p.vels[i] = {
                x: (Math.random() - 0.5) * 50, // px/s
                y: (Math.random() - 0.5) * 40,
            };
        });
        p.lastTs = performance.now();
        tick();
    };
    
    const tick = () => {
        const p = physics.current;
        const now = performance.now();
        let dt = (now - p.lastTs) / 1000; // s
        if (dt > 0.05) dt = 0.05; // 防止卡顿导致步长过大
        p.lastTs = now;
        
        const maxOffset = 24; // 允许围绕锚点小幅位移
        const count = imgRefs.current.length;
        
        // 速度扰动 + 保持最低速度，避免停下来
        const MIN_SPEED = 20; // px/s
        const MAX_SPEED = 80; // px/s
        for (let i = 0; i < count; i++) {
            const v = p.vels[i];
            if (!v) continue;
            // 随机加速度，制造持续的波动
            v.x += (Math.random() - 0.5) * 30 * dt; // px/s
            v.y += (Math.random() - 0.5) * 30 * dt;
            // 限速并维持最小速度
            let speed = Math.sqrt(v.x * v.x + v.y * v.y);
            if (speed < MIN_SPEED) {
                const scale = MIN_SPEED / (speed || 0.001);
                v.x *= scale; v.y *= scale;
            } else if (speed > MAX_SPEED) {
                const scale = MAX_SPEED / speed;
                v.x *= scale; v.y *= scale;
            }
        }
        
        // 位置更新与边界反弹
        const layerRect = bgRef.current.getBoundingClientRect();
        const quanBoxPadding = 10 * (layerRect.width / 750); // px2vw(10) 转换为实际像素
        for (let i = 0; i < count; i++) {
            const o = p.offsets[i];
            const v = p.vels[i];
            const a = p.anchors[i];
            const s = p.sizes[i];
            if (!o || !v || !a || !s) continue;
            o.x += v.x * dt;
            o.y += v.y * dt;
            
            // 计算图片当前的实际左右边界
            const imgLeft = a.x + o.x;
            const imgRight = a.x + o.x + s.w;
            const containerLeft = quanBoxPadding;
            const containerRight = layerRect.width - quanBoxPadding;
            
            // 左右边界限制：不超出 quanBox 的实际宽度
            if (imgLeft < containerLeft) {
                o.x = containerLeft - a.x;
                v.x *= -1;
            }
            if (imgRight > containerRight) {
                o.x = containerRight - a.x - s.w;
                v.x *= -1;
            }
            
            // 上下边界使用原有的 maxOffset 限制
            if (o.y > maxOffset) { o.y = maxOffset; v.y *= -1; }
            if (o.y < -maxOffset) { o.y = -maxOffset; v.y *= -1; }
            // 极轻阻尼，保证能量基本不衰减
            v.x *= 0.999; v.y *= 0.999;
        }
        
        // 圆形碰撞检测与响应（等质量弹性碰撞）
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const ai = p.anchors[i], aj = p.anchors[j];
                const si = p.sizes[i], sj = p.sizes[j];
                const oi = p.offsets[i], oj = p.offsets[j];
                if (!ai || !aj || !si || !sj || !oi || !oj) continue;
                const ci = { x: ai.x + oi.x + si.w / 2, y: ai.y + oi.y + si.h / 2 };
                const cj = { x: aj.x + oj.x + sj.w / 2, y: aj.y + oj.y + sj.h / 2 };
                const dx = cj.x - ci.x;
                const dy = cj.y - ci.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                const minDist = si.r + sj.r;
                if (dist < minDist) {
                    // 纠正重叠位置
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    oi.x -= nx * overlap / 2;
                    oi.y -= ny * overlap / 2;
                    oj.x += nx * overlap / 2;
                    oj.y += ny * overlap / 2;
                    // 速度沿法线分量交换
                    const vi = p.vels[i];
                    const vj = p.vels[j];
                    const viN = vi.x * nx + vi.y * ny;
                    const vjN = vj.x * nx + vj.y * ny;
                    const viT = { x: vi.x - viN * nx, y: vi.y - viN * ny };
                    const vjT = { x: vj.x - vjN * nx, y: vj.y - vjN * ny };
                    vi.x = viT.x + vjN * nx; vi.y = viT.y + vjN * ny;
                    vj.x = vjT.x + viN * nx; vj.y = vjT.y + viN * ny;
                }
            }
        }
        
        // 应用到 DOM（避免每帧 setState）
        for (let i = 0; i < count; i++) {
            const el = imgRefs.current[i];
            const o = p.offsets[i];
            if (el && o) {
                el.style.transform = `scale(1.1) translate(${o.x}px, ${o.y}px)`;
            }
        }
        
        p.rafId = requestAnimationFrame(tick);
    };
    
    useEffect(() => () => {
        const p = physics.current;
        if (p.rafId) cancelAnimationFrame(p.rafId);
    }, []);
    //https://gnitem.koolearn.com/api/product/queryBuyStatus?courseType=11&queryId=2&queryType=2&userId=82318885
    
    
    const checkBuyStatus = async () => {
        const userId = sessionStorage.getItem('GIO_F');
        const domain = ENV.isProduction ? 'gnitem.koolearn.com' : (
            ENV.isYufa ? 'gnitemtest.koolearn.com' : 'gnitem.neibu.koolearn.com'
        );
        const url1 = `https://${domain}/api/product/queryBuyStatus?courseType=2&queryId=2&queryType=2&userId=${userId}`;
        const url2 = `https://${domain}/api/product/queryBuyStatus?courseType=3&queryId=2&queryType=2&userId=${userId}`;
        try {
            const res1 = await fetch(url1, { credentials: 'include' });
            const json1 = await res1.json();
    
            const res2 = await fetch(url2, { credentials: 'include' });
            const json2 = await res2.json();
            return json1.data === true || json2.data === true;
        } catch (e) {
            return false;
        }
    };
    
    const goList = async (type) => {
        const button_name = type == 1 ? '政治时政' : '考研英语';
        gioEmit('ztjx_xcx_practice_home', {
            event_name: '真题解析_练背_首页按钮点击',
            button_name
        });
        if (type == 2) {
            const hasBought = await checkBuyStatus();
            if (!hasBought) {
                Toast.show({ content: '该功能目前仅开放给新东方在线正价课学员～' });
                return;
            }
        }
        if (type == 1) {
            history.push(`/practice/list?flashcardSetId=${flashcardSetId}&title=${button_name}`);
        } else {
            history.push(`/practice/lianlian_enlist?title=${button_name}`);
        }
    };
    const gotoMy =  ()=>{
        history.push(`/practice/my?titleBg=FF300C&flashcardSetId=1&title=个人中心`);
    }
    return (
        <>
        {/*https://guonei-cos.koocdn.com/common/930f511319634ba3b35d4c705e118f9f.png*/}
        <div className={cx('box')}>
<div className={cx('topImgbox')}>
<img src="https://guonei-cos.koocdn.com/common/7160618db0404744bfdd09ddee1d4973.png"/>
        <img src="https://guonei-cos.koocdn.com/common/eec7b4161d8a4aae98a82e8e5091d8a7.png" onClick={ ()=>{ gotoMy() } }/>
    </div>
    {/*<div className={cx('mainPractice')}>*/}
    {/*    <img src="https://guonei-cos.koocdn.com/common/065756cacaf84ae0aed021c995d4d386.png"/>*/}
    {/*</div>*/}
<div className={cx('mainBg')} ref={bgRef}>
        {/*<img src={mainBg} />*/}
        <img src="https://guonei-cos.koocdn.com/common/065756cacaf84ae0aed021c995d4d386.png" alt=""/>
        <div className={cx('quanBox')} onClick={handleQuanClick}>
        <img src={img1} ref={(el) => (imgRefs.current[0] = el)} onLoad={handleImgLoad} />
    <img src={img2} ref={(el) => (imgRefs.current[1] = el)} onLoad={handleImgLoad} />
    <img src={img3} ref={(el) => (imgRefs.current[2] = el)} onLoad={handleImgLoad} onClick={handleImg3Click} />
    <img src={img4} ref={(el) => (imgRefs.current[3] = el)} onLoad={handleImgLoad} />
    <img src={img5} ref={(el) => (imgRefs.current[4] = el)} onLoad={handleImgLoad} />
    <img src={img6} ref={(el) => (imgRefs.current[5] = el)} onLoad={handleImgLoad} />
    <img src={img7} ref={(el) => (imgRefs.current[6] = el)} onLoad={handleImgLoad} />
    </div>
    {/* 浮动层：显示“好运+1” */}
<div className={cx('floatLayer')}>
    {floaters.map((f, i) => {
        // 超过5个后，较早的逐渐透明
        const count = floaters.length;
        const indexFromNewest = count - i - 1; // 0 是最新
        const baseOpacity = indexFromNewest < 5 ? 1 : Math.max(0, 1 - 0.2 * (indexFromNewest - 4));
        return (
            <div
        key={f.id}
        className={cx('floatText')}
        style={{ left: f.x, top: f.y, opacity: baseOpacity, animationDuration: `${FLOAT_DURATION}ms` }}
    >
        好运+1
        </div>
    );
    })}
</div>
    </div>
    </div>
    <div className={cx('fixedBottomDiv')}>
<button className={cx('updateButton', 'leftButton')} onClick={() => goList(1)}>
    政治时政
    </button>
    <button className={cx('updateButton', 'rightButton')} onClick={() => goList(2)}>
    考研必刷单词闪卡
    <div className={cx('bubbleTip')}>首发！恋练有词同款学习工具</div>
    </button>
    </div>
    {modalVisible && (
    <AnswerQuestionModal
        visible={modalVisible}
        onClose={handleCloseModal}
        getProblemFeedback={getProblemFeedback}
        />
    )}
</>
);
};

export default Practice;
