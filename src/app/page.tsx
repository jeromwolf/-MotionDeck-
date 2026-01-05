'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProjects, loadProjects, getStorageEstimate } from './db';
import * as LucideIcons from 'lucide-react';
import {
  // 기본
  Star, Heart, Check, X, Plus, Minus, Circle, Square, Triangle, Diamond,
  Hexagon, Octagon, Pentagon, Sparkles,
  // 화살표
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  MoveRight, MoveLeft, MoveUp, MoveDown, CornerDownRight, CornerUpLeft,
  // 미디어
  Play, Pause, Video, Music, Camera, Mic, Volume2, VolumeX, Image,
  Film, Radio, Podcast, Tv, Disc, PlayCircle, PauseCircle, SkipForward, SkipBack,
  // 커뮤니케이션
  Mail, Phone, MessageCircle, Send, Share, Bell, User, Users,
  MessageSquare, AtSign, Voicemail, PhoneCall, PhoneOff, BellRing, UserPlus, UserMinus,
  // 파일
  File, Folder, Download, Upload, Save, Copy, Trash2, Edit,
  FileText, FilePlus, FolderOpen, FolderPlus, Archive, Paperclip, ClipboardList, ClipboardCheck,
  // 비즈니스
  TrendingUp, TrendingDown, BarChart2, PieChart, DollarSign, ShoppingCart, Target, Award,
  Briefcase, Building, Building2, Store, Receipt, Wallet, CreditCard, Banknote,
  // 기술
  Code, Terminal, Database, Server, Globe, Cpu, Cloud, Wifi,
  CodeXml, Braces, Binary, GitBranch, GitCommit, Github, Bug, Wrench,
  // 기기
  Smartphone, Monitor, Laptop, Tablet, Watch, Headphones, Printer, HardDrive,
  Mouse, Keyboard, Gamepad2, Router, Speaker, Webcam, Battery, BatteryCharging,
  // 소셜미디어
  Youtube, Twitter, Instagram, Facebook, Linkedin, Twitch, Slack, Figma,
  // 이모지/감정
  Smile, Frown, Meh, ThumbsUp, ThumbsDown, PartyPopper, Angry, Laugh,
  // 자연
  Leaf, Flower, Trees, Mountain, Waves, Flame, Snowflake, Sunrise,
  CloudRain, CloudSnow, CloudSun, Wind, Droplets, Rainbow, Cloudy, SunMoon,
  // 음식
  Coffee, Pizza, Apple, Cake, Wine, Beer, Utensils, CookingPot,
  // 교통
  Car, Plane, Train, Bike, Ship, Rocket, Bus, Truck,
  // 건강
  Activity, HeartPulse, Pill, Stethoscope, Syringe, Thermometer, Ambulance, Hospital,
  // 스포츠
  Trophy, Medal, Flag, Timer, Dumbbell, Volleyball, Footprints, PersonStanding,
  // 기타
  Lightbulb, Zap, Settings, Search, Home, Lock, Unlock, Eye, EyeOff,
  Calendar, Clock, Bookmark, Tag, Hash, Percent, Infinity,
  Gift, ShoppingBag, Package, Box, Map, MapPin, Navigation, Compass,
  Key, Shield, ShieldCheck, AlertTriangle, AlertCircle, Info, HelpCircle,
  Sun, Moon, Glasses, Palette, Wand2, Crown, Gem, Feather,
  // 추가 아이콘 (기존 호환)
  Link, ExternalLink, RefreshCw, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize, Usb
} from 'lucide-react';

// 아이콘 카테고리
const iconCategories: Record<string, string[]> = {
  '기본': ['Star', 'Heart', 'Check', 'X', 'Plus', 'Minus', 'Circle', 'Square', 'Triangle', 'Diamond', 'Hexagon', 'Octagon', 'Pentagon', 'Sparkles'],
  '화살표': ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown', 'MoveRight', 'MoveLeft', 'MoveUp', 'MoveDown', 'CornerDownRight', 'CornerUpLeft'],
  '미디어': ['Play', 'Pause', 'Video', 'Music', 'Camera', 'Mic', 'Volume2', 'VolumeX', 'Image', 'Film', 'Radio', 'Podcast', 'Tv', 'Disc', 'PlayCircle', 'PauseCircle', 'SkipForward', 'SkipBack'],
  '커뮤니케이션': ['Mail', 'Phone', 'MessageCircle', 'Send', 'Share', 'Bell', 'User', 'Users', 'MessageSquare', 'AtSign', 'Voicemail', 'PhoneCall', 'PhoneOff', 'BellRing', 'UserPlus', 'UserMinus'],
  '파일': ['File', 'Folder', 'Download', 'Upload', 'Save', 'Copy', 'Trash2', 'Edit', 'FileText', 'FilePlus', 'FolderOpen', 'FolderPlus', 'Archive', 'Paperclip', 'ClipboardList', 'ClipboardCheck'],
  '비즈니스': ['TrendingUp', 'TrendingDown', 'BarChart2', 'PieChart', 'DollarSign', 'ShoppingCart', 'Target', 'Award', 'Briefcase', 'Building', 'Building2', 'Store', 'Receipt', 'Wallet', 'CreditCard', 'Banknote'],
  '기술': ['Code', 'Terminal', 'Database', 'Server', 'Globe', 'Cpu', 'Cloud', 'Wifi', 'CodeXml', 'Braces', 'Binary', 'GitBranch', 'GitCommit', 'Github', 'Bug', 'Wrench'],
  '기기': ['Smartphone', 'Monitor', 'Laptop', 'Tablet', 'Watch', 'Headphones', 'Printer', 'HardDrive', 'Mouse', 'Keyboard', 'Gamepad2', 'Router', 'Speaker', 'Webcam', 'Battery', 'BatteryCharging'],
  '소셜미디어': ['Youtube', 'Twitter', 'Instagram', 'Facebook', 'Linkedin', 'Twitch', 'Slack', 'Figma'],
  '이모지': ['Smile', 'Frown', 'Meh', 'ThumbsUp', 'ThumbsDown', 'PartyPopper', 'Angry', 'Laugh'],
  '자연': ['Leaf', 'Flower', 'Trees', 'Mountain', 'Waves', 'Flame', 'Snowflake', 'Sunrise', 'CloudRain', 'CloudSnow', 'CloudSun', 'Wind', 'Droplets', 'Rainbow', 'Cloudy', 'SunMoon'],
  '음식': ['Coffee', 'Pizza', 'Apple', 'Cake', 'Wine', 'Beer', 'Utensils', 'CookingPot'],
  '교통': ['Car', 'Plane', 'Train', 'Bike', 'Ship', 'Rocket', 'Bus', 'Truck'],
  '건강': ['Activity', 'HeartPulse', 'Pill', 'Stethoscope', 'Syringe', 'Thermometer', 'Ambulance', 'Hospital'],
  '스포츠': ['Trophy', 'Medal', 'Flag', 'Timer', 'Dumbbell', 'Volleyball', 'Footprints', 'PersonStanding'],
  '기타': ['Lightbulb', 'Zap', 'Settings', 'Search', 'Home', 'Lock', 'Unlock', 'Eye', 'EyeOff', 'Calendar', 'Clock', 'Bookmark', 'Tag', 'Hash', 'Percent', 'Infinity', 'Gift', 'ShoppingBag', 'Package', 'Box', 'Map', 'MapPin', 'Navigation', 'Compass', 'Key', 'Shield', 'ShieldCheck', 'AlertTriangle', 'AlertCircle', 'Info', 'HelpCircle', 'Sun', 'Moon', 'Glasses', 'Palette', 'Wand2', 'Crown', 'Gem', 'Feather'],
};

const iconComponents: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  // 기본
  Star, Heart, Check, X, Plus, Minus, Circle, Square, Triangle, Diamond, Hexagon, Octagon, Pentagon, Sparkles,
  // 화살표
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  MoveRight, MoveLeft, MoveUp, MoveDown, CornerDownRight, CornerUpLeft,
  // 미디어
  Play, Pause, Video, Music, Camera, Mic, Volume2, VolumeX, Image,
  Film, Radio, Podcast, Tv, Disc, PlayCircle, PauseCircle, SkipForward, SkipBack,
  // 커뮤니케이션
  Mail, Phone, MessageCircle, Send, Share, Bell, User, Users,
  MessageSquare, AtSign, Voicemail, PhoneCall, PhoneOff, BellRing, UserPlus, UserMinus,
  // 파일
  File, Folder, Download, Upload, Save, Copy, Trash2, Edit,
  FileText, FilePlus, FolderOpen, FolderPlus, Archive, Paperclip, ClipboardList, ClipboardCheck,
  // 비즈니스
  TrendingUp, TrendingDown, BarChart2, PieChart, DollarSign, ShoppingCart, Target, Award,
  Briefcase, Building, Building2, Store, Receipt, Wallet, CreditCard, Banknote,
  // 기술
  Code, Terminal, Database, Server, Globe, Cpu, Cloud, Wifi,
  CodeXml, Braces, Binary, GitBranch, GitCommit, Github, Bug, Wrench,
  // 기기
  Smartphone, Monitor, Laptop, Tablet, Watch, Headphones, Printer, HardDrive,
  Mouse, Keyboard, Gamepad2, Router, Speaker, Webcam, Battery, BatteryCharging,
  // 소셜미디어
  Youtube, Twitter, Instagram, Facebook, Linkedin, Twitch, Slack, Figma,
  // 이모지
  Smile, Frown, Meh, ThumbsUp, ThumbsDown, PartyPopper, Angry, Laugh,
  // 자연
  Leaf, Flower, Trees, Mountain, Waves, Flame, Snowflake, Sunrise,
  CloudRain, CloudSnow, CloudSun, Wind, Droplets, Rainbow, Cloudy, SunMoon,
  // 음식
  Coffee, Pizza, Apple, Cake, Wine, Beer, Utensils, CookingPot,
  // 교통
  Car, Plane, Train, Bike, Ship, Rocket, Bus, Truck,
  // 건강
  Activity, HeartPulse, Pill, Stethoscope, Syringe, Thermometer, Ambulance, Hospital,
  // 스포츠
  Trophy, Medal, Flag, Timer, Dumbbell, Volleyball, Footprints, PersonStanding,
  // 기타
  Lightbulb, Zap, Settings, Search, Home, Lock, Unlock, Eye, EyeOff,
  Calendar, Clock, Bookmark, Tag, Hash, Percent, Infinity,
  Gift, ShoppingBag, Package, Box, Map, MapPin, Navigation, Compass,
  Key, Shield, ShieldCheck, AlertTriangle, AlertCircle, Info, HelpCircle,
  Sun, Moon, Glasses, Palette, Wand2, Crown, Gem, Feather,
  // 추가 아이콘 (기존 호환)
  Link, ExternalLink, RefreshCw, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize, Usb,
};

// 도형 타입
type ShapeType =
  | 'rectangle' | 'rounded-rectangle' | 'circle' | 'oval'
  | 'triangle' | 'triangle-down' | 'diamond' | 'star'
  | 'pentagon' | 'hexagon' | 'octagon' | 'heart'
  | 'arrow-right' | 'arrow-left' | 'arrow-up' | 'arrow-down'
  | 'speech-bubble' | 'cross' | 'line';

const shapeLabels: Record<ShapeType, string> = {
  'rectangle': '사각형',
  'rounded-rectangle': '둥근 사각형',
  'circle': '원',
  'oval': '타원',
  'triangle': '삼각형',
  'triangle-down': '역삼각형',
  'diamond': '다이아몬드',
  'star': '별',
  'pentagon': '오각형',
  'hexagon': '육각형',
  'octagon': '팔각형',
  'heart': '하트',
  'arrow-right': '오른쪽 화살표',
  'arrow-left': '왼쪽 화살표',
  'arrow-up': '위쪽 화살표',
  'arrow-down': '아래쪽 화살표',
  'speech-bubble': '말풍선',
  'cross': '십자가',
  'line': '선',
};

// 도형별 clip-path 정의
const shapeClipPaths: Record<ShapeType, string> = {
  'rectangle': 'none',
  'rounded-rectangle': 'none',
  'circle': 'none',
  'oval': 'ellipse(50% 40% at 50% 50%)',
  'triangle': 'polygon(50% 0%, 0% 100%, 100% 100%)',
  'triangle-down': 'polygon(0% 0%, 100% 0%, 50% 100%)',
  'diamond': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  'star': 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  'pentagon': 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  'hexagon': 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  'octagon': 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
  'heart': 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
  'arrow-right': 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  'arrow-left': 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
  'arrow-up': 'polygon(50% 0%, 100% 40%, 80% 40%, 80% 100%, 20% 100%, 20% 40%, 0% 40%)',
  'arrow-down': 'polygon(20% 0%, 80% 0%, 80% 60%, 100% 60%, 50% 100%, 0% 60%, 20% 60%)',
  'speech-bubble': 'polygon(0% 0%, 100% 0%, 100% 70%, 70% 70%, 50% 100%, 50% 70%, 0% 70%)',
  'cross': 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)',
  'line': 'none',
};

// 애니메이션 타입
type AnimationType =
  | 'none' | 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight'
  | 'zoomIn' | 'zoomOut' | 'bounce' | 'rotate' | 'rotateIn' | 'flip' | 'flipX' | 'flipY'
  | 'pulse' | 'shake' | 'swing' | 'rubberBand' | 'tada' | 'wobble' | 'jello';

// Easing 타입
type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';

// 애니메이션 설정 인터페이스
interface AnimationConfig {
  type: AnimationType;
  duration: number;  // 0.1 ~ 3초
  delay: number;     // 0 ~ 5초
  easing: EasingType;
}

// 타입 정의
interface SlideElement {
  id: string;
  type: 'text' | 'code' | 'image' | 'icon' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontStyle?: string;
    textDecoration?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
  animation?: AnimationType;
  animationConfig?: AnimationConfig;
}

// 사용 가능한 폰트
const fontFamilies = [
  { name: '기본', value: 'inherit' },
  { name: 'Sans Serif', value: 'ui-sans-serif, system-ui, sans-serif' },
  { name: 'Serif', value: 'ui-serif, Georgia, serif' },
  { name: 'Mono', value: 'ui-monospace, monospace' },
  { name: 'Noto Sans KR', value: '"Noto Sans KR", sans-serif' },
  { name: 'Pretendard', value: 'Pretendard, sans-serif' },
];

// 애니메이션 variants
const animationVariants: Record<AnimationType, { initial: object; animate: object }> = {
  none: { initial: {}, animate: {} },
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  slideUp: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
  slideDown: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } },
  slideLeft: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
  slideRight: { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
  zoomIn: { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 } },
  zoomOut: { initial: { opacity: 0, scale: 1.5 }, animate: { opacity: 1, scale: 1 } },
  bounce: { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.5 } } },
  rotate: { initial: { opacity: 0, rotate: -180 }, animate: { opacity: 1, rotate: 0 } },
  rotateIn: { initial: { opacity: 0, rotate: 90, scale: 0.5 }, animate: { opacity: 1, rotate: 0, scale: 1 } },
  flip: { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 } },
  flipX: { initial: { opacity: 0, rotateX: 90 }, animate: { opacity: 1, rotateX: 0 } },
  flipY: { initial: { opacity: 0, rotateY: 180 }, animate: { opacity: 1, rotateY: 0 } },
  pulse: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: [1, 1.05, 1], transition: { scale: { repeat: 2, duration: 0.3 } } } },
  shake: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: [0, -10, 10, -10, 10, 0], transition: { x: { duration: 0.5 } } } },
  swing: { initial: { opacity: 0, rotate: -15 }, animate: { opacity: 1, rotate: [0, 15, -10, 5, -5, 0], transition: { rotate: { duration: 0.6 } } } },
  rubberBand: { initial: { opacity: 0, scaleX: 1 }, animate: { opacity: 1, scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1], scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1], transition: { duration: 0.6 } } },
  tada: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: [1, 0.9, 1.1, 1.1, 1], rotate: [0, -3, 3, -3, 3, 0], transition: { duration: 0.6 } } },
  wobble: { initial: { opacity: 0, x: 0 }, animate: { opacity: 1, x: [0, -25, 20, -15, 10, -5, 0], rotate: [0, -5, 3, -3, 2, -1, 0], transition: { duration: 0.8 } } },
  jello: { initial: { opacity: 0, skewX: 0 }, animate: { opacity: 1, skewX: [0, -12.5, 6.25, -3.125, 1.5625, 0], skewY: [0, -12.5, 6.25, -3.125, 1.5625, 0], transition: { duration: 0.8 } } },
};

const animationLabels: Record<AnimationType, string> = {
  none: '없음',
  fadeIn: '페이드 인',
  slideUp: '아래에서 위로',
  slideDown: '위에서 아래로',
  slideLeft: '오른쪽에서 왼쪽',
  slideRight: '왼쪽에서 오른쪽',
  zoomIn: '확대',
  zoomOut: '축소',
  bounce: '바운스',
  rotate: '회전',
  rotateIn: '회전 등장',
  flip: '플립',
  flipX: '플립 X',
  flipY: '플립 Y',
  pulse: '펄스',
  shake: '흔들기',
  swing: '스윙',
  rubberBand: '탄성',
  tada: '타다',
  wobble: '비틀기',
  jello: '젤리',
};

// Easing 옵션
const easingOptions: { value: EasingType; label: string }[] = [
  { value: 'linear', label: '선형' },
  { value: 'easeIn', label: '천천히 시작' },
  { value: 'easeOut', label: '천천히 끝' },
  { value: 'easeInOut', label: '부드럽게' },
  { value: 'spring', label: '스프링' },
];

// 슬라이드 전환 효과 타입
type SlideTransitionType = 'fade' | 'slide' | 'slideUp' | 'slideDown' | 'zoom' | 'flip' | 'cube' | 'cover';

const slideTransitionLabels: Record<SlideTransitionType, string> = {
  fade: '페이드',
  slide: '슬라이드',
  slideUp: '위로 슬라이드',
  slideDown: '아래로 슬라이드',
  zoom: '줌',
  flip: '플립',
  cube: '큐브',
  cover: '커버',
};

const slideTransitionVariants: Record<SlideTransitionType, { initial: object; animate: object; exit: object }> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  slideDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 },
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
  },
  cube: {
    initial: { opacity: 0, rotateY: 90, transformOrigin: 'left center' },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90, transformOrigin: 'right center' },
  },
  cover: {
    initial: { opacity: 1, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 1, x: 0 },
  },
};

interface Slide {
  id: string;
  name: string;
  elements: SlideElement[];
  background: string;
  notes?: string; // 발표자 노트/자막
  transition?: SlideTransitionType;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
}

// 기본 슬라이드 템플릿
const createDefaultSlide = (): Slide => ({
  id: Date.now().toString(),
  name: 'Slide 1',
  elements: [
    {
      id: 'title-' + Date.now(),
      type: 'text',
      content: '제목을 입력하세요',
      x: 100,
      y: 180,
      width: 600,
      height: 80,
      style: { fontSize: 48, fontWeight: 'bold', color: '#171717' }
    },
    {
      id: 'subtitle-' + Date.now(),
      type: 'text',
      content: '부제목을 입력하세요',
      x: 100,
      y: 260,
      width: 400,
      height: 40,
      style: { fontSize: 24, color: '#6b7280' }
    }
  ],
  background: '#ffffff'
});

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [removingBg, setRemovingBg] = useState<string | null>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconCategory, setIconCategory] = useState<string>('기본');
  const [showShapePicker, setShowShapePicker] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false); // 발표자 노트 보기
  const [isAudienceWindow, setIsAudienceWindow] = useState(false); // 청중용 창인지
  const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null); // 드래그 중인 슬라이드

  // Undo/Redo 히스토리
  const [history, setHistory] = useState<Project[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);

  const dragStart = useRef<{ x: number; y: number; elemX: number; elemY: number } | null>(null);
  const audienceWindowRef = useRef<Window | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const isAudienceWindowRef = useRef(false);
  const resizeStart = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // IndexedDB에서 프로젝트 로드
  useEffect(() => {
    const load = async () => {
      try {
        const savedProjects = await loadProjects();
        if (savedProjects.length > 0) {
          setProjects(savedProjects);
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
        // IndexedDB 실패 시 localStorage fallback
        const saved = localStorage.getItem('motiondeck-projects');
        if (saved) {
          try {
            setProjects(JSON.parse(saved));
          } catch (e2) {
            console.error('Failed to load from localStorage:', e2);
          }
        }
      }
      setIsLoaded(true);
    };
    load();
  }, []);

  // 청중용 창인지 확인 & BroadcastChannel 설정
  useEffect(() => {
    // URL 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const isAudience = params.get('audience') === 'true';
    const projectId = params.get('projectId');

    if (isAudience && projectId) {
      setIsAudienceWindow(true);
      isAudienceWindowRef.current = true;
      setPresentationMode(true);
    }

    // BroadcastChannel 설정
    broadcastChannelRef.current = new BroadcastChannel('motiondeck-sync');

    broadcastChannelRef.current.onmessage = (event) => {
      const { type, slideIndex, projectData } = event.data;

      if (type === 'slideChange' && isAudienceWindowRef.current) {
        setCurrentSlideIndex(slideIndex);
      } else if (type === 'projectData' && isAudienceWindowRef.current) {
        setCurrentProject(projectData);
        setPresentationMode(true);
      } else if (type === 'endPresentation' && isAudienceWindowRef.current) {
        window.close();
      }
    };

    return () => {
      broadcastChannelRef.current?.close();
    };
  }, []);

  // 청중용 창이 열릴 때 프로젝트 데이터 전송
  useEffect(() => {
    if (presenterMode && currentProject && broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'projectData',
        projectData: currentProject
      });
    }
  }, [presenterMode, currentProject]);

  // 슬라이드 변경 시 청중용 창에 동기화
  useEffect(() => {
    if (presenterMode && broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'slideChange',
        slideIndex: currentSlideIndex
      });
    }
  }, [currentSlideIndex, presenterMode]);

  // 발표자 모드 시작 - 청중용 창 열기
  const startPresenterMode = () => {
    // 청중용 창 열기
    const url = `${window.location.origin}${window.location.pathname}?audience=true&projectId=${currentProject?.id}`;
    audienceWindowRef.current = window.open(url, 'audienceWindow', 'width=1280,height=720');

    setPresenterMode(true);
    setPresentationMode(true);
    setCurrentSlideIndex(0);

    // 잠시 후 프로젝트 데이터 전송
    setTimeout(() => {
      broadcastChannelRef.current?.postMessage({
        type: 'projectData',
        projectData: currentProject
      });
    }, 500);
  };

  // 발표자 모드 종료
  const endPresenterMode = () => {
    broadcastChannelRef.current?.postMessage({ type: 'endPresentation' });
    audienceWindowRef.current?.close();
    audienceWindowRef.current = null;
    setPresentationMode(false);
    setPresenterMode(false);
  };

  // 프로젝트 저장 (IndexedDB)
  useEffect(() => {
    if (isLoaded && projects.length > 0) {
      const save = async () => {
        try {
          await saveProjects(projects);
        } catch (e) {
          console.error('Failed to save to IndexedDB:', e);
          alert('저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.');
        }
      };
      save();
    }
  }, [projects, isLoaded]);

  // 히스토리에 현재 상태 저장 (프로젝트 변경 시)
  useEffect(() => {
    if (!currentProject || isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }

    // 새 히스토리 항목 추가
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      // 마지막 항목과 동일한지 확인 (중복 방지)
      const lastItem = newHistory[newHistory.length - 1];
      if (lastItem && JSON.stringify(lastItem) === JSON.stringify(currentProject)) {
        return prev;
      }
      return [...newHistory, JSON.parse(JSON.stringify(currentProject))].slice(-50); // 최대 50개 유지
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [currentProject?.slides]);

  // Undo 함수
  const undo = () => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevState = history[historyIndex - 1];
      setCurrentProject(JSON.parse(JSON.stringify(prevState)));
      setHistoryIndex(historyIndex - 1);
      setSelectedElement(null);
    }
  };

  // Redo 함수
  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const nextState = history[historyIndex + 1];
      setCurrentProject(JSON.parse(JSON.stringify(nextState)));
      setHistoryIndex(historyIndex + 1);
      setSelectedElement(null);
    }
  };

  // 현재 프로젝트 자동 저장
  useEffect(() => {
    if (currentProject) {
      setProjects(prev =>
        prev.map(p =>
          p.id === currentProject.id
            ? { ...currentProject, updatedAt: new Date().toISOString() }
            : p
        )
      );
    }
  }, [currentProject]);

  // 키보드 이벤트
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo (에디터 모드에서만)
      if (!presentationMode && currentProject) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
          e.preventDefault();
          redo();
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
          e.preventDefault();
          redo();
        }
      }

      if (presentationMode && currentProject) {
        if (e.key === 'Escape') {
          if (presenterMode) {
            endPresenterMode();
          } else if (!isAudienceWindow) {
            setPresentationMode(false);
          }
        } else if (e.key === 'ArrowRight' || e.key === ' ') {
          if (!isAudienceWindow) {
            setCurrentSlideIndex(i => Math.min(currentProject.slides.length - 1, i + 1));
          }
        } else if (e.key === 'ArrowLeft') {
          if (!isAudienceWindow) {
            setCurrentSlideIndex(i => Math.max(0, i - 1));
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, presenterMode, isAudienceWindow, currentProject, historyIndex, history]);

  // 새 프로젝트 생성
  const createProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '새 프로젝트',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [createDefaultSlide()]
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
    setCurrentSlideIndex(0);
    setSelectedElement(null);
  };

  // 프로젝트 삭제
  const deleteProject = (projectId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  // 프로젝트 열기
  const openProject = (project: Project) => {
    setCurrentProject(project);
    setCurrentSlideIndex(0);
    setSelectedElement(null);
  };

  // 홈으로 돌아가기
  const goHome = () => {
    setCurrentProject(null);
    setSelectedElement(null);
  };

  // 프로젝트 내보내기 (JSON 다운로드)
  const exportProjects = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `framerslide-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 단일 프로젝트 내보내기
  const exportSingleProject = (project: Project) => {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 프로젝트 가져오기
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // 단일 프로젝트인지 배열인지 확인
        if (Array.isArray(data)) {
          // 여러 프로젝트
          const newProjects = data.map((p: Project) => ({
            ...p,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            updatedAt: new Date().toISOString()
          }));
          setProjects(prev => [...newProjects, ...prev]);
          alert(`${newProjects.length}개 프로젝트를 가져왔습니다.`);
        } else if (data.slides) {
          // 단일 프로젝트
          const newProject: Project = {
            ...data,
            id: Date.now().toString(),
            updatedAt: new Date().toISOString()
          };
          setProjects(prev => [newProject, ...prev]);
          alert(`"${newProject.name}" 프로젝트를 가져왔습니다.`);
        } else {
          alert('올바른 프로젝트 파일이 아닙니다.');
        }
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다.');
        console.error(err);
      }
    };
    reader.readAsText(file);

    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
  };

  // 슬라이드 관련 함수들
  const currentSlide = currentProject?.slides[currentSlideIndex];

  const addSlide = () => {
    if (!currentProject) return;
    const newSlide: Slide = {
      id: Date.now().toString(),
      name: `Slide ${currentProject.slides.length + 1}`,
      elements: [],
      background: '#ffffff'
    };
    setCurrentProject({
      ...currentProject,
      slides: [...currentProject.slides, newSlide]
    });
    setCurrentSlideIndex(currentProject.slides.length);
  };

  const addTextElement = () => {
    if (!currentProject || !currentSlide) return;
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'text',
      content: '텍스트를 입력하세요',
      x: 100,
      y: 100,
      width: 300,
      height: 50,
      style: { fontSize: 24, color: '#171717' }
    };
    const updatedSlides = [...currentProject.slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setCurrentProject({ ...currentProject, slides: updatedSlides });
    setSelectedElement(newElement.id);
  };

  const addCodeElement = () => {
    if (!currentProject || !currentSlide) return;
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'code',
      content: '// 코드를 입력하세요\nconst hello = "world";',
      x: 100,
      y: 100,
      width: 500,
      height: 200,
      style: { fontSize: 14, color: '#374151' }
    };
    const updatedSlides = [...currentProject.slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setCurrentProject({ ...currentProject, slides: updatedSlides });
    setSelectedElement(newElement.id);
  };

  const addIconElement = (iconName: string) => {
    if (!currentProject || !currentSlide) return;

    // 기존 아이콘 요소 변경인 경우
    if (selectedElement) {
      const selectedEl = currentSlide.elements.find(e => e.id === selectedElement);
      if (selectedEl?.type === 'icon') {
        updateElement(selectedElement, { content: iconName });
        setShowIconPicker(false);
        return;
      }
    }

    // 새 아이콘 추가
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'icon',
      content: iconName,
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      style: { fontSize: 64, color: '#171717' }
    };
    const updatedSlides = [...currentProject.slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setCurrentProject({ ...currentProject, slides: updatedSlides });
    setSelectedElement(newElement.id);
    setShowIconPicker(false);
  };

  const addShapeElement = (shapeType: ShapeType) => {
    if (!currentProject || !currentSlide) return;
    const newElement: SlideElement = {
      id: Date.now().toString(),
      type: 'shape',
      content: shapeType,
      x: 100,
      y: 100,
      width: 120,
      height: shapeType === 'line' ? 4 : 120,
      style: {
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 2,
      }
    };
    const updatedSlides = [...currentProject.slides];
    updatedSlides[currentSlideIndex].elements.push(newElement);
    setCurrentProject({ ...currentProject, slides: updatedSlides });
    setSelectedElement(newElement.id);
    setShowShapePicker(false);
  };

  // 이미지 압축 함수
  const compressImage = (dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = dataUrl;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentProject || !currentSlide) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      let imageData = event.target?.result as string;

      // 이미지 크기가 100KB 이상이면 압축
      if (imageData.length > 100000) {
        imageData = await compressImage(imageData);
      }

      const newElement: SlideElement = {
        id: Date.now().toString(),
        type: 'image',
        content: imageData,
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        style: {}
      };
      const updatedSlides = [...currentProject.slides];
      updatedSlides[currentSlideIndex].elements.push(newElement);
      setCurrentProject({ ...currentProject, slides: updatedSlides });
      setSelectedElement(newElement.id);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 저장 공간 사용량 상태
  const [storageInfo, setStorageInfo] = useState({ usedMB: 0, quotaMB: 0, percent: 0 });

  // 저장 공간 사용량 업데이트
  useEffect(() => {
    const updateStorage = async () => {
      try {
        const estimate = await getStorageEstimate();
        const usedMB = Math.round(estimate.usage / 1024 / 1024);
        const quotaMB = Math.round(estimate.quota / 1024 / 1024);
        const percent = quotaMB > 0 ? Math.round((usedMB / quotaMB) * 100) : 0;
        setStorageInfo({ usedMB, quotaMB, percent });
      } catch {
        setStorageInfo({ usedMB: 0, quotaMB: 0, percent: 0 });
      }
    };
    if (isLoaded) {
      updateStorage();
    }
  }, [projects, isLoaded]);

  const updateSlideBackground = (color: string) => {
    if (!currentProject) return;
    const updatedSlides = currentProject.slides.map((slide, index) =>
      index === currentSlideIndex ? { ...slide, background: color } : slide
    );
    setCurrentProject({ ...currentProject, slides: updatedSlides });
  };

  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    if (!currentProject) return;
    const updatedSlides = currentProject.slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.map(el =>
              el.id === elementId
                ? { ...el, ...updates, style: { ...el.style, ...updates.style } }
                : el
            )
          }
        : slide
    );
    setCurrentProject({ ...currentProject, slides: updatedSlides });
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string, element: SlideElement) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    setDragging(elementId);
    dragStart.current = { x: e.clientX, y: e.clientY, elemX: element.x, elemY: element.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 리사이즈 처리
    if (resizing && resizeStart.current) {
      const dx = (e.clientX - resizeStart.current.x) / zoom;
      const dy = (e.clientY - resizeStart.current.y) / zoom;
      const newWidth = Math.max(50, resizeStart.current.width + dx);
      const newHeight = Math.max(50, resizeStart.current.height + dy);
      updateElement(resizing, { width: newWidth, height: newHeight });
      return;
    }
    // 드래그 처리
    if (!dragging || !dragStart.current) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    updateElement(dragging, { x: dragStart.current.elemX + dx, y: dragStart.current.elemY + dy });
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    dragStart.current = null;
    resizeStart.current = null;
  };

  // 리사이즈 시작
  const handleResizeStart = (e: React.MouseEvent, elementId: string, element: SlideElement) => {
    e.stopPropagation();
    setResizing(elementId);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: element.width,
      height: element.height
    };
  };

  // 리사이즈 중
  const handleResizeMove = (e: React.MouseEvent) => {
    if (!resizing || !resizeStart.current) return;

    const dx = (e.clientX - resizeStart.current.x) / zoom;
    const dy = (e.clientY - resizeStart.current.y) / zoom;

    const newWidth = Math.max(50, resizeStart.current.width + dx);
    const newHeight = Math.max(50, resizeStart.current.height + dy);

    updateElement(resizing, { width: newWidth, height: newHeight });
  };

  // 배경 제거 (Canvas 기반 - 흰색/밝은 배경을 투명하게)
  const removeImageBackground = async (elementId: string, imageData: string) => {
    setRemovingBg(elementId);
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageData;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      ctx.drawImage(img, 0, 0);
      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageDataObj.data;

      // 흰색/밝은 색상 배경을 투명하게 변환
      const threshold = 240;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageDataObj, 0, 0);
      const resultDataUrl = canvas.toDataURL('image/png');
      updateElement(elementId, { content: resultDataUrl });
      setRemovingBg(null);
    } catch (err) {
      console.error('Background removal failed:', err);
      alert('배경 제거에 실패했습니다.');
      setRemovingBg(null);
    }
  };

  // 슬라이드 순서 변경
  const handleSlideDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSlideIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSlideDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedSlideIndex === null || draggedSlideIndex === index || !currentProject) return;

    const newSlides = [...currentProject.slides];
    const draggedSlide = newSlides[draggedSlideIndex];
    newSlides.splice(draggedSlideIndex, 1);
    newSlides.splice(index, 0, draggedSlide);

    setCurrentProject({ ...currentProject, slides: newSlides });

    // 현재 선택된 슬라이드 인덱스 업데이트
    if (currentSlideIndex === draggedSlideIndex) {
      setCurrentSlideIndex(index);
    }
    setDraggedSlideIndex(index);
  };

  const handleSlideDragEnd = () => {
    setDraggedSlideIndex(null);
  };

  // 슬라이드 복제
  const duplicateSlide = (index: number) => {
    if (!currentProject) return;
    const slideToDuplicate = currentProject.slides[index];
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: Date.now().toString(),
      name: `${slideToDuplicate.name} (복사)`,
      elements: slideToDuplicate.elements.map(el => ({ ...el, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }))
    };
    const newSlides = [...currentProject.slides];
    newSlides.splice(index + 1, 0, newSlide);
    setCurrentProject({ ...currentProject, slides: newSlides });
    setCurrentSlideIndex(index + 1);
  };

  // 슬라이드 삭제
  const deleteSlide = (index: number) => {
    if (!currentProject || currentProject.slides.length <= 1) {
      alert('최소 1개의 슬라이드가 필요합니다.');
      return;
    }
    const newSlides = currentProject.slides.filter((_, i) => i !== index);
    setCurrentProject({ ...currentProject, slides: newSlides });
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    } else if (currentSlideIndex > index) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
    setSelectedElement(null);
  };

  // 요소 레이어 순서 변경
  const moveElementLayer = (elementId: string, direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!currentProject || !currentSlide) return;
    const elements = [...currentSlide.elements];
    const index = elements.findIndex(el => el.id === elementId);
    if (index === -1) return;

    const element = elements[index];
    elements.splice(index, 1);

    let newIndex: number;
    switch (direction) {
      case 'up':
        newIndex = Math.min(elements.length, index + 1);
        break;
      case 'down':
        newIndex = Math.max(0, index - 1);
        break;
      case 'top':
        newIndex = elements.length;
        break;
      case 'bottom':
        newIndex = 0;
        break;
    }
    elements.splice(newIndex, 0, element);

    const updatedSlides = currentProject.slides.map((slide, i) =>
      i === currentSlideIndex ? { ...slide, elements } : slide
    );
    setCurrentProject({ ...currentProject, slides: updatedSlides });
  };

  const selectedEl = currentSlide?.elements.find(e => e.id === selectedElement);

  const backgroundPresets = [
    '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
    '#0a0a0a', '#171717', '#1e293b', '#0f172a',
    '#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3',
  ];

  const gradientPresets = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(180deg, #2c3e50 0%, #3498db 100%)',
    'linear-gradient(135deg, #232526 0%, #414345 100%)',
    'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
    'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  ];

  // 로딩 중
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-muted">로딩 중...</div>
      </div>
    );
  }

  // 슬라이드 렌더링 컴포넌트 (프레젠테이션용)
  // Easing 값 변환 함수
  const getEasingValue = (easing: EasingType): string | object => {
    switch (easing) {
      case 'linear': return 'linear';
      case 'easeIn': return 'easeIn';
      case 'easeOut': return 'easeOut';
      case 'easeInOut': return 'easeInOut';
      case 'spring': return { type: 'spring', stiffness: 100, damping: 10 };
      default: return 'easeOut';
    }
  };

  const renderSlideContent = (slide: Slide, isPreview = false) => (
    <>
      {slide.elements.map((element, index) => {
        const anim = element.animation || 'fadeIn';
        const variant = animationVariants[anim];
        const config = element.animationConfig;
        const duration = config?.duration || 0.5;
        const delay = config?.delay ?? index * 0.1;
        const easing = config?.easing || 'easeOut';

        return (
          <motion.div
            key={element.id}
            initial={isPreview ? {} : variant.initial}
            animate={isPreview ? {} : variant.animate}
            transition={
              easing === 'spring'
                ? { type: 'spring', stiffness: 100, damping: 10, delay }
                : { duration, delay, ease: easing }
            }
            className="absolute"
            style={{
              left: `${(element.x / 800) * 100}%`,
              top: `${(element.y / 450) * 100}%`,
              width: `${(element.width / 800) * 100}%`,
            }}
          >
            {element.type === 'text' && (
              <div style={{
                fontSize: isPreview ? `${(element.style.fontSize || 16) * 0.3}px` : `clamp(12px, ${(element.style.fontSize || 16) / 800 * 100}vw, ${(element.style.fontSize || 16) * 2}px)`,
                color: element.style.color,
                fontWeight: element.style.fontWeight,
                fontFamily: element.style.fontFamily,
                fontStyle: element.style.fontStyle,
                textDecoration: element.style.textDecoration,
                textAlign: element.style.textAlign || 'left',
              }}>
                {element.content}
              </div>
            )}
            {element.type === 'code' && (
              <div className="code-block" style={{ fontSize: isPreview ? '6px' : `clamp(10px, 1.5vw, 18px)` }}>
                <div className="flex items-center gap-1 mb-1 pb-1 border-b border-border">
                  <div className={`${isPreview ? 'w-1 h-1' : 'w-2.5 h-2.5'} rounded-full bg-red-500`} />
                  <div className={`${isPreview ? 'w-1 h-1' : 'w-2.5 h-2.5'} rounded-full bg-yellow-500`} />
                  <div className={`${isPreview ? 'w-1 h-1' : 'w-2.5 h-2.5'} rounded-full bg-green-500`} />
                </div>
                <pre style={{ color: element.style.color }}>{element.content}</pre>
              </div>
            )}
            {element.type === 'image' && (
              <img src={element.content} alt="" className="w-full h-auto object-contain" draggable={false} />
            )}
            {element.type === 'icon' && iconComponents[element.content] && (
              <div style={{ color: element.style.color }}>
                {(() => {
                  const IconComponent = iconComponents[element.content];
                  return <IconComponent size={isPreview ? (element.style.fontSize || 64) * 0.3 : element.style.fontSize || 64} />;
                })()}
              </div>
            )}
            {element.type === 'shape' && (
              element.content === 'heart' ? (
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={element.style.backgroundColor || '#ef4444'}
                    stroke={element.style.borderColor || '#dc2626'}
                    strokeWidth={element.style.borderWidth || 1}
                  />
                </svg>
              ) : (
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: element.style.backgroundColor,
                    border: element.content === 'line'
                      ? 'none'
                      : `${element.style.borderWidth || 2}px solid ${element.style.borderColor || '#000'}`,
                    borderRadius: element.content === 'circle' ? '50%'
                      : element.content === 'rounded-rectangle' ? '16px'
                      : element.content === 'oval' ? '50%'
                      : element.content === 'rectangle' ? '4px'
                      : '0',
                    clipPath: shapeClipPaths[element.content as ShapeType] || 'none',
                    borderTop: element.content === 'line'
                      ? `${element.style.borderWidth || 4}px solid ${element.style.borderColor || element.style.backgroundColor || '#000'}`
                      : undefined,
                    height: element.content === 'line' ? '0' : '100%',
                    marginTop: element.content === 'line' ? '50%' : '0',
                  }}
                />
              )
            )}
          </motion.div>
        );
      })}
    </>
  );

  // 청중용 창 (프레젠테이션만 표시, 컨트롤 없음)
  if (isAudienceWindow && presentationMode && currentProject && currentSlide) {
    const transitionType = currentSlide.transition || 'fade';
    const transitionVariant = slideTransitionVariants[transitionType];
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={transitionVariant.initial}
            animate={transitionVariant.animate}
            exit={transitionVariant.exit}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative"
            style={{
              width: '100vw',
              height: '100vh',
              maxWidth: '177.78vh',
              maxHeight: '56.25vw',
              background: currentSlide.background,
            }}
          >
            {renderSlideContent(currentSlide)}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // 프레젠테이션 모드 (일반)
  if (presentationMode && !presenterMode && !isAudienceWindow && currentProject && currentSlide) {
    const transitionType = currentSlide.transition || 'slide';
    const transitionVariant = slideTransitionVariants[transitionType];
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={transitionVariant.initial}
            animate={transitionVariant.animate}
            exit={transitionVariant.exit}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="relative"
            style={{
              width: '100vw',
              height: '100vh',
              maxWidth: '177.78vh',
              maxHeight: '56.25vw',
              background: currentSlide.background,
            }}
          >
            {renderSlideContent(currentSlide)}
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur px-6 py-3 rounded-full">
          <button
            onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}
            disabled={currentSlideIndex === 0}
            className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
          >
            ← 이전
          </button>
          <span className="text-white/70 text-sm">
            {currentSlideIndex + 1} / {currentProject.slides.length}
          </span>
          <button
            onClick={() => setCurrentSlideIndex(i => Math.min(currentProject.slides.length - 1, i + 1))}
            disabled={currentSlideIndex === currentProject.slides.length - 1}
            className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
          >
            다음 →
          </button>
          <div className="w-px h-4 bg-white/30" />
          <button onClick={() => setPresentationMode(false)} className="text-white/70 hover:text-white transition-colors">
            ESC 종료
          </button>
        </div>
      </div>
    );
  }

  // 발표자 모드 (노트 표시)
  if (presentationMode && presenterMode && !isAudienceWindow && currentProject && currentSlide) {
    const nextSlide = currentProject.slides[currentSlideIndex + 1];
    const transitionType = currentSlide.transition || 'zoom';
    const transitionVariant = slideTransitionVariants[transitionType];

    return (
      <div className="fixed inset-0 bg-zinc-900 flex">
        {/* 왼쪽: 현재 슬라이드 & 다음 슬라이드 미리보기 */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* 현재 슬라이드 */}
          <div className="flex-1 flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={transitionVariant.initial}
                animate={transitionVariant.animate}
                exit={transitionVariant.exit}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: '800px',
                  aspectRatio: '16/9',
                  background: currentSlide.background,
                }}
              >
                {renderSlideContent(currentSlide)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 하단: 다음 슬라이드 미리보기 & 네비게이션 */}
          <div className="flex items-center gap-4 px-4">
            {/* 다음 슬라이드 미리보기 */}
            {nextSlide ? (
              <div className="flex-shrink-0">
                <div className="text-xs text-zinc-400 mb-2">다음 슬라이드</div>
                <div
                  className="relative rounded-lg overflow-hidden border border-zinc-700"
                  style={{
                    width: '200px',
                    aspectRatio: '16/9',
                    background: nextSlide.background,
                  }}
                >
                  {renderSlideContent(nextSlide, true)}
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0">
                <div className="text-xs text-zinc-400 mb-2">다음 슬라이드</div>
                <div className="w-[200px] aspect-video rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-500 text-sm">마지막 슬라이드</span>
                </div>
              </div>
            )}

            {/* 네비게이션 */}
            <div className="flex-1 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentSlideIndex(i => Math.max(0, i - 1))}
                disabled={currentSlideIndex === 0}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-white transition-colors"
              >
                ← 이전
              </button>
              <span className="text-white text-lg font-medium px-4">
                {currentSlideIndex + 1} / {currentProject.slides.length}
              </span>
              <button
                onClick={() => setCurrentSlideIndex(i => Math.min(currentProject.slides.length - 1, i + 1))}
                disabled={currentSlideIndex === currentProject.slides.length - 1}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-lg text-white transition-colors"
              >
                다음 →
              </button>
            </div>

            {/* 종료 버튼 */}
            <button
              onClick={endPresenterMode}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              종료 (ESC)
            </button>
          </div>
        </div>

        {/* 오른쪽: 발표자 노트 */}
        <div className="w-[400px] border-l border-zinc-700 bg-zinc-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">발표자 노트</h3>
            <span className="text-sm text-zinc-400">{currentSlide.name}</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {currentSlide.notes ? (
              <div className="text-white text-lg leading-relaxed whitespace-pre-wrap">
                {currentSlide.notes}
              </div>
            ) : (
              <div className="text-zinc-500 text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <p>이 슬라이드에 노트가 없습니다</p>
                <p className="text-sm mt-2">에디터에서 발표자 노트를 추가하세요</p>
              </div>
            )}
          </div>

          {/* 현재 시간 표시 */}
          <div className="mt-4 pt-4 border-t border-zinc-700 text-center">
            <div className="text-3xl font-mono text-white">
              {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 홈 화면 (프로젝트 목록)
  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background">
        {/* 가져오기용 숨겨진 input */}
        <input
          ref={importInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <header className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">MotionDeck</h1>
            <div className="flex items-center gap-4">
              {/* 저장 공간 표시 */}
              <div className="flex items-center gap-2 text-sm text-muted">
                <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${storageInfo.percent > 80 ? 'bg-red-500' : storageInfo.percent > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(storageInfo.percent, 100)}%` }}
                  />
                </div>
                <span>{storageInfo.usedMB}MB / {storageInfo.quotaMB > 1000 ? `${Math.round(storageInfo.quotaMB / 1024)}GB` : `${storageInfo.quotaMB}MB`}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => importInputRef.current?.click()}
                  className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors"
                >
                  가져오기
                </button>
                {projects.length > 0 && (
                  <button
                    onClick={exportProjects}
                    className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors"
                  >
                    전체 내보내기
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">내 프로젝트</h2>
            <button
              onClick={createProject}
              className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              새 프로젝트
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📑</div>
              <h3 className="text-xl font-medium mb-2">프로젝트가 없습니다</h3>
              <p className="text-muted mb-6">새 프로젝트를 만들어 프레젠테이션을 시작하세요</p>
              <button
                onClick={createProject}
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
              >
                + 새 프로젝트 만들기
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent transition-colors"
                >
                  <button
                    onClick={() => openProject(project)}
                    className="w-full text-left"
                  >
                    <div
                      className="aspect-video flex items-center justify-center text-muted border-b border-border"
                      style={{ background: project.slides[0]?.background || '#ffffff' }}
                    >
                      <span className="text-sm">{project.slides.length}개 슬라이드</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1 truncate">{project.name}</h3>
                      <p className="text-sm text-muted">
                        {new Date(project.updatedAt).toLocaleDateString('ko-KR')} 수정
                      </p>
                    </div>
                  </button>
                  <div className="px-4 pb-4 flex items-center gap-3">
                    <button
                      onClick={() => exportSingleProject(project)}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      내보내기
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-sm text-red-400 hover:text-red-500 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // 에디터 화면
  return (
    <div className="h-screen flex flex-col bg-background">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={goHome}
            className="text-muted hover:text-foreground transition-colors"
          >
            ← 홈
          </button>
          <div className="h-6 w-px bg-border" />
          <input
            type="text"
            value={currentProject.name}
            onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
            className="text-lg font-semibold bg-transparent border-none outline-none"
          />
          <div className="h-6 w-px bg-border" />
          <div className="flex gap-2">
            <button onClick={addTextElement} className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors">
              + 텍스트
            </button>
            <button onClick={addCodeElement} className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors">
              + 코드
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors">
              + 이미지
            </button>
            <button onClick={() => setShowIconPicker(true)} className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors">
              + 아이콘
            </button>
            <button onClick={() => setShowShapePicker(true)} className="px-3 py-1.5 text-sm bg-card hover:bg-border rounded-lg transition-colors">
              + 도형
            </button>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="w-8 h-8 flex items-center justify-center bg-card hover:bg-border disabled:opacity-30 rounded-lg transition-colors"
              title="실행 취소 (Ctrl+Z)"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="w-8 h-8 flex items-center justify-center bg-card hover:bg-border disabled:opacity-30 rounded-lg transition-colors"
              title="다시 실행 (Ctrl+Shift+Z)"
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="w-8 h-8 flex items-center justify-center bg-card hover:bg-border rounded-lg transition-colors">−</button>
            <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="w-8 h-8 flex items-center justify-center bg-card hover:bg-border rounded-lg transition-colors">+</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={startPresenterMode}
            className="px-4 py-1.5 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            발표자 모드
          </button>
          <button
            onClick={() => { setPresenterMode(false); setPresentationMode(true); setCurrentSlideIndex(0); }}
            className="px-4 py-1.5 text-sm bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors"
          >
            ▶ 프레젠테이션
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-48 border-r border-border p-3 flex flex-col gap-2 overflow-y-auto">
          <div className="text-xs text-muted uppercase tracking-wider mb-2">슬라이드</div>
          {currentProject.slides.map((slide, index) => (
            <div
              key={slide.id}
              draggable
              onDragStart={(e) => handleSlideDragStart(e, index)}
              onDragOver={(e) => handleSlideDragOver(e, index)}
              onDragEnd={handleSlideDragEnd}
              onClick={() => { setCurrentSlideIndex(index); setSelectedElement(null); }}
              className={`group p-2 rounded-lg text-left text-sm transition-colors cursor-grab active:cursor-grabbing ${
                index === currentSlideIndex ? 'bg-accent text-white' : 'bg-card hover:bg-border'
              } ${draggedSlideIndex === index ? 'opacity-50' : ''}`}
            >
              <div
                className="aspect-video rounded mb-2 flex items-center justify-center text-xs border border-border pointer-events-none relative"
                style={{ background: slide.background }}
              >
                <span className={slide.background === '#ffffff' || slide.background.startsWith('#f') ? 'text-gray-500' : 'text-white/70'}>
                  {index + 1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="pointer-events-none truncate flex-1">{slide.name}</span>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); duplicateSlide(index); }}
                    className={`p-1 rounded text-xs ${index === currentSlideIndex ? 'hover:bg-white/20' : 'hover:bg-accent/20'}`}
                    title="복제"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteSlide(index); }}
                    className={`p-1 rounded text-xs ${index === currentSlideIndex ? 'hover:bg-white/20 text-red-200' : 'hover:bg-red-500/20 text-red-400'}`}
                    title="삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addSlide}
            className="p-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-card transition-colors border border-dashed border-border"
          >
            + 슬라이드 추가
          </button>
        </aside>

        <main
          className="flex-1 p-8 overflow-auto flex items-center justify-center bg-zinc-100"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {currentSlide && (
            <div
              ref={canvasRef}
              className="relative rounded-lg shadow-2xl border border-border"
              style={{
                width: 800,
                height: 450,
                background: currentSlide.background,
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              onClick={() => setSelectedElement(null)}
            >
              {currentSlide.elements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute ${dragging === element.id ? 'cursor-grabbing' : 'cursor-grab'} ${
                    selectedElement === element.id ? 'ring-2 ring-accent' : ''
                  }`}
                  style={{ left: element.x, top: element.y, width: element.width, userSelect: 'none' }}
                  onMouseDown={(e) => handleMouseDown(e, element.id, element)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {element.type === 'text' && (
                    <div className="relative" style={{ width: element.width, height: element.height }}>
                      <div
                        className="w-full h-full overflow-hidden"
                        style={{
                          fontSize: element.style.fontSize,
                          color: element.style.color,
                          fontWeight: element.style.fontWeight,
                          fontFamily: element.style.fontFamily,
                          fontStyle: element.style.fontStyle,
                          textDecoration: element.style.textDecoration,
                          textAlign: element.style.textAlign || 'left',
                        }}
                      >
                        {element.content}
                      </div>
                      {selectedElement === element.id && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-tl-sm"
                          onMouseDown={(e) => handleResizeStart(e, element.id, element)}
                        />
                      )}
                    </div>
                  )}
                  {element.type === 'code' && (
                    <div className="relative" style={{ width: element.width, height: element.height }}>
                      <div className="code-block h-full overflow-auto">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        </div>
                        <pre style={{ fontSize: element.style.fontSize, color: element.style.color }}>{element.content}</pre>
                      </div>
                      {selectedElement === element.id && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-tl-sm"
                          onMouseDown={(e) => handleResizeStart(e, element.id, element)}
                        />
                      )}
                    </div>
                  )}
                  {element.type === 'image' && (
                    <div className="relative" style={{ width: element.width, height: element.height }}>
                      <img
                        src={element.content}
                        alt=""
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                      {selectedElement === element.id && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-tl-sm"
                          onMouseDown={(e) => handleResizeStart(e, element.id, element)}
                        />
                      )}
                      {removingBg === element.id && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                          <div className="text-white text-sm">배경 제거 중...</div>
                        </div>
                      )}
                    </div>
                  )}
                  {element.type === 'icon' && iconComponents[element.content] && (
                    <div className="relative" style={{ width: element.width, height: element.height }}>
                      <div style={{ color: element.style.color }} className="w-full h-full flex items-center justify-center">
                        {(() => {
                          const IconComponent = iconComponents[element.content];
                          return <IconComponent size={Math.min(element.width, element.height) * 0.8} />;
                        })()}
                      </div>
                      {selectedElement === element.id && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-tl-sm"
                          onMouseDown={(e) => handleResizeStart(e, element.id, element)}
                        />
                      )}
                    </div>
                  )}
                  {element.type === 'shape' && (
                    <div className="relative" style={{ width: element.width, height: element.height }}>
                      {element.content === 'heart' ? (
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                          <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            fill={element.style.backgroundColor || '#ef4444'}
                            stroke={element.style.borderColor || '#dc2626'}
                            strokeWidth={element.style.borderWidth || 1}
                          />
                        </svg>
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundColor: element.style.backgroundColor,
                            border: element.content === 'line'
                              ? 'none'
                              : `${element.style.borderWidth || 2}px solid ${element.style.borderColor || '#000'}`,
                            borderRadius: element.content === 'circle' ? '50%'
                              : element.content === 'rounded-rectangle' ? '16px'
                              : element.content === 'oval' ? '50%'
                              : element.content === 'rectangle' ? '4px'
                              : '0',
                            clipPath: shapeClipPaths[element.content as ShapeType] || 'none',
                            borderTop: element.content === 'line'
                              ? `${element.style.borderWidth || 4}px solid ${element.style.borderColor || element.style.backgroundColor || '#000'}`
                              : undefined,
                            height: element.content === 'line' ? '0' : '100%',
                            marginTop: element.content === 'line' ? '50%' : '0',
                          }}
                        />
                      )}
                      {selectedElement === element.id && (
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 bg-accent cursor-se-resize rounded-tl-sm"
                          onMouseDown={(e) => handleResizeStart(e, element.id, element)}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>

        <aside className="w-64 border-l border-border p-4 overflow-y-auto">
          {selectedEl ? (
            <>
              <div className="text-xs text-muted uppercase tracking-wider mb-4">요소 속성</div>
              <div className="space-y-4">
                {selectedEl.type !== 'image' && selectedEl.type !== 'icon' && (
                  <div>
                    <label className="text-sm text-muted block mb-1">내용</label>
                    <textarea
                      value={selectedEl.content}
                      onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                      className="w-full p-2 bg-card border border-border rounded-lg text-sm resize-none"
                      rows={4}
                    />
                  </div>
                )}
                {selectedEl.type === 'icon' && (
                  <>
                    <div>
                      <label className="text-sm text-muted block mb-1">아이콘</label>
                      <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                        {iconComponents[selectedEl.content] && (() => {
                          const IconComponent = iconComponents[selectedEl.content];
                          return <IconComponent size={24} />;
                        })()}
                        <span className="text-sm">{selectedEl.content}</span>
                        <button
                          onClick={() => setShowIconPicker(true)}
                          className="ml-auto px-2 py-1 text-xs bg-accent text-white rounded"
                        >
                          변경
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">크기</label>
                      <input
                        type="number"
                        value={selectedEl.style.fontSize || 64}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, fontSize: parseInt(e.target.value) } })}
                        className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">색상</label>
                      <input
                        type="color"
                        value={selectedEl.style.color || '#171717'}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, color: e.target.value } })}
                        className="w-full h-10 bg-card border border-border rounded-lg cursor-pointer"
                      />
                    </div>
                  </>
                )}
                {selectedEl.type === 'shape' && (
                  <>
                    <div>
                      <label className="text-sm text-muted block mb-1">도형</label>
                      <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg">
                        <span className="text-sm">{shapeLabels[selectedEl.content as ShapeType] || selectedEl.content}</span>
                        <button
                          onClick={() => setShowShapePicker(true)}
                          className="ml-auto px-2 py-1 text-xs bg-accent text-white rounded"
                        >
                          변경
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">배경색</label>
                      <input
                        type="color"
                        value={selectedEl.style.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, backgroundColor: e.target.value } })}
                        className="w-full h-10 bg-card border border-border rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">테두리 색상</label>
                      <input
                        type="color"
                        value={selectedEl.style.borderColor || '#2563eb'}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, borderColor: e.target.value } })}
                        className="w-full h-10 bg-card border border-border rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">테두리 두께</label>
                      <input
                        type="number"
                        value={selectedEl.style.borderWidth || 2}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, borderWidth: parseInt(e.target.value) } })}
                        className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                      />
                    </div>
                  </>
                )}
                {selectedEl.type === 'text' && (
                  <>
                    <div>
                      <label className="text-sm text-muted block mb-1">폰트</label>
                      <select
                        value={selectedEl.style.fontFamily || 'inherit'}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, fontFamily: e.target.value } })}
                        className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                      >
                        {fontFamilies.map((font) => (
                          <option key={font.value} value={font.value}>{font.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">폰트 크기</label>
                      <input
                        type="number"
                        value={selectedEl.style.fontSize || 16}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, fontSize: parseInt(e.target.value) } })}
                        className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-1">색상</label>
                      <input
                        type="color"
                        value={selectedEl.style.color || '#171717'}
                        onChange={(e) => updateElement(selectedEl.id, { style: { ...selectedEl.style, color: e.target.value } })}
                        className="w-full h-10 bg-card border border-border rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-2">스타일</label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, fontWeight: selectedEl.style.fontWeight === 'bold' ? 'normal' : 'bold' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${selectedEl.style.fontWeight === 'bold' ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="굵게"
                        >
                          <strong>B</strong>
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, fontStyle: selectedEl.style.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${selectedEl.style.fontStyle === 'italic' ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="기울임"
                        >
                          <em>I</em>
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, textDecoration: selectedEl.style.textDecoration === 'underline' ? 'none' : 'underline' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${selectedEl.style.textDecoration === 'underline' ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="밑줄"
                        >
                          <u>U</u>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-muted block mb-2">정렬</label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, textAlign: 'left' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${(!selectedEl.style.textAlign || selectedEl.style.textAlign === 'left') ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="왼쪽 정렬"
                        >
                          ≡
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, textAlign: 'center' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${selectedEl.style.textAlign === 'center' ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="가운데 정렬"
                        >
                          ≡
                        </button>
                        <button
                          onClick={() => updateElement(selectedEl.id, { style: { ...selectedEl.style, textAlign: 'right' } })}
                          className={`flex-1 p-2 text-sm rounded-lg transition-colors ${selectedEl.style.textAlign === 'right' ? 'bg-accent text-white' : 'bg-card hover:bg-border'}`}
                          title="오른쪽 정렬"
                        >
                          ≡
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm text-muted block mb-1">크기</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted">너비</span>
                      <input type="number" value={Math.round(selectedEl.width)} onChange={(e) => updateElement(selectedEl.id, { width: parseInt(e.target.value) })} className="w-full p-2 bg-card border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <span className="text-xs text-muted">높이</span>
                      <input type="number" value={Math.round(selectedEl.height)} onChange={(e) => updateElement(selectedEl.id, { height: parseInt(e.target.value) })} className="w-full p-2 bg-card border border-border rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted block mb-1">위치</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs text-muted">X</span>
                      <input type="number" value={Math.round(selectedEl.x)} onChange={(e) => updateElement(selectedEl.id, { x: parseInt(e.target.value) })} className="w-full p-2 bg-card border border-border rounded-lg text-sm" />
                    </div>
                    <div>
                      <span className="text-xs text-muted">Y</span>
                      <input type="number" value={Math.round(selectedEl.y)} onChange={(e) => updateElement(selectedEl.id, { y: parseInt(e.target.value) })} className="w-full p-2 bg-card border border-border rounded-lg text-sm" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted block">애니메이션</label>
                  <select
                    value={selectedEl.animation || 'none'}
                    onChange={(e) => updateElement(selectedEl.id, { animation: e.target.value as AnimationType })}
                    className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                  >
                    {(Object.keys(animationLabels) as AnimationType[]).map((key) => (
                      <option key={key} value={key}>{animationLabels[key]}</option>
                    ))}
                  </select>

                  {selectedEl.animation && selectedEl.animation !== 'none' && (
                    <div className="space-y-3 p-3 bg-card rounded-lg border border-border">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted">지속 시간</span>
                          <span className="text-xs text-foreground">{(selectedEl.animationConfig?.duration || 0.5).toFixed(1)}초</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="3"
                          step="0.1"
                          value={selectedEl.animationConfig?.duration || 0.5}
                          onChange={(e) => updateElement(selectedEl.id, {
                            animationConfig: {
                              ...selectedEl.animationConfig,
                              type: selectedEl.animation || 'none',
                              duration: parseFloat(e.target.value),
                              delay: selectedEl.animationConfig?.delay || 0,
                              easing: selectedEl.animationConfig?.easing || 'easeOut',
                            }
                          })}
                          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted">딜레이</span>
                          <span className="text-xs text-foreground">{(selectedEl.animationConfig?.delay || 0).toFixed(1)}초</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.1"
                          value={selectedEl.animationConfig?.delay || 0}
                          onChange={(e) => updateElement(selectedEl.id, {
                            animationConfig: {
                              ...selectedEl.animationConfig,
                              type: selectedEl.animation || 'none',
                              duration: selectedEl.animationConfig?.duration || 0.5,
                              delay: parseFloat(e.target.value),
                              easing: selectedEl.animationConfig?.easing || 'easeOut',
                            }
                          })}
                          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted block mb-1">이징</span>
                        <select
                          value={selectedEl.animationConfig?.easing || 'easeOut'}
                          onChange={(e) => updateElement(selectedEl.id, {
                            animationConfig: {
                              ...selectedEl.animationConfig,
                              type: selectedEl.animation || 'none',
                              duration: selectedEl.animationConfig?.duration || 0.5,
                              delay: selectedEl.animationConfig?.delay || 0,
                              easing: e.target.value as EasingType,
                            }
                          })}
                          className="w-full p-2 bg-background border border-border rounded-lg text-sm"
                        >
                          {easingOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted">프레젠테이션 모드에서 적용됩니다</p>
                </div>
                {selectedEl.type === 'image' && (
                  <div>
                    <label className="text-sm text-muted block mb-2">이미지 도구</label>
                    <button
                      onClick={() => removeImageBackground(selectedEl.id, selectedEl.content)}
                      disabled={removingBg === selectedEl.id}
                      className="w-full p-2 text-sm bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-lg transition-colors"
                    >
                      {removingBg === selectedEl.id ? '처리 중...' : '배경 제거'}
                    </button>
                    <p className="text-xs text-muted mt-1">흰색 배경을 투명하게 변환합니다</p>
                  </div>
                )}
                <div>
                  <label className="text-sm text-muted block mb-2">레이어 순서</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveElementLayer(selectedEl.id, 'top')}
                      className="flex-1 p-2 text-xs bg-card hover:bg-border rounded-lg transition-colors"
                      title="맨 앞으로"
                    >
                      <ChevronUp size={14} className="mx-auto" />
                      <ChevronUp size={14} className="mx-auto -mt-2" />
                    </button>
                    <button
                      onClick={() => moveElementLayer(selectedEl.id, 'up')}
                      className="flex-1 p-2 text-xs bg-card hover:bg-border rounded-lg transition-colors"
                      title="앞으로"
                    >
                      <ChevronUp size={14} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => moveElementLayer(selectedEl.id, 'down')}
                      className="flex-1 p-2 text-xs bg-card hover:bg-border rounded-lg transition-colors"
                      title="뒤로"
                    >
                      <ChevronDown size={14} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => moveElementLayer(selectedEl.id, 'bottom')}
                      className="flex-1 p-2 text-xs bg-card hover:bg-border rounded-lg transition-colors"
                      title="맨 뒤로"
                    >
                      <ChevronDown size={14} className="mx-auto" />
                      <ChevronDown size={14} className="mx-auto -mt-2" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const newElement = {
                        ...selectedEl,
                        id: Date.now().toString(),
                        x: selectedEl.x + 20,
                        y: selectedEl.y + 20,
                      };
                      const updatedSlides = currentProject.slides.map((slide, index) =>
                        index === currentSlideIndex
                          ? { ...slide, elements: [...slide.elements, newElement] }
                          : slide
                      );
                      setCurrentProject({ ...currentProject, slides: updatedSlides });
                      setSelectedElement(newElement.id);
                    }}
                    className="flex-1 p-2 text-sm bg-card hover:bg-border rounded-lg transition-colors"
                  >
                    복제
                  </button>
                  <button
                    onClick={() => {
                      const updatedSlides = currentProject.slides.map((slide, index) =>
                        index === currentSlideIndex
                          ? { ...slide, elements: slide.elements.filter(e => e.id !== selectedEl.id) }
                          : slide
                      );
                      setCurrentProject({ ...currentProject, slides: updatedSlides });
                      setSelectedElement(null);
                    }}
                    className="flex-1 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-muted uppercase tracking-wider mb-4">슬라이드 속성</div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted block mb-2">단색 배경</label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {backgroundPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSlideBackground(color)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          currentSlide?.background === color ? 'border-accent scale-110' : 'border-border hover:border-muted'
                        }`}
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={currentSlide?.background?.startsWith('#') ? currentSlide.background : '#ffffff'}
                    onChange={(e) => updateSlideBackground(e.target.value)}
                    className="w-full h-10 bg-card border border-border rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted block mb-2">그라데이션</label>
                  <div className="grid grid-cols-4 gap-2">
                    {gradientPresets.map((gradient, index) => (
                      <button
                        key={index}
                        onClick={() => updateSlideBackground(gradient)}
                        className={`w-full aspect-square rounded-lg border-2 transition-all ${
                          currentSlide?.background === gradient ? 'border-accent scale-110' : 'border-border hover:border-muted'
                        }`}
                        style={{ background: gradient }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted block mb-2">슬라이드 전환 효과</label>
                  <select
                    value={currentSlide?.transition || 'slide'}
                    onChange={(e) => {
                      const updatedSlides = currentProject.slides.map((slide, index) =>
                        index === currentSlideIndex ? { ...slide, transition: e.target.value as SlideTransitionType } : slide
                      );
                      setCurrentProject({ ...currentProject, slides: updatedSlides });
                    }}
                    className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                  >
                    {(Object.keys(slideTransitionLabels) as SlideTransitionType[]).map((key) => (
                      <option key={key} value={key}>{slideTransitionLabels[key]}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted mt-1">프레젠테이션 모드에서 이 슬라이드로 전환 시 적용</p>
                </div>
                <div>
                  <label className="text-sm text-muted block mb-1">슬라이드 이름</label>
                  <input
                    type="text"
                    value={currentSlide?.name || ''}
                    onChange={(e) => {
                      const updatedSlides = currentProject.slides.map((slide, index) =>
                        index === currentSlideIndex ? { ...slide, name: e.target.value } : slide
                      );
                      setCurrentProject({ ...currentProject, slides: updatedSlides });
                    }}
                    className="w-full p-2 bg-card border border-border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted block mb-1">발표자 노트</label>
                  <textarea
                    value={currentSlide?.notes || ''}
                    onChange={(e) => {
                      const updatedSlides = currentProject.slides.map((slide, index) =>
                        index === currentSlideIndex ? { ...slide, notes: e.target.value } : slide
                      );
                      setCurrentProject({ ...currentProject, slides: updatedSlides });
                    }}
                    placeholder="발표할 때 읽을 내용을 입력하세요..."
                    className="w-full p-2 bg-card border border-border rounded-lg text-sm resize-none"
                    rows={6}
                  />
                  <p className="text-xs text-muted mt-1">발표자 모드에서 표시됩니다</p>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* 아이콘 피커 모달 */}
      {showIconPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowIconPicker(false)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">아이콘 선택</h3>
              <button onClick={() => setShowIconPicker(false)} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            {/* 카테고리 탭 */}
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-border">
              {Object.keys(iconCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setIconCategory(category)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    iconCategory === category ? 'bg-accent text-white' : 'bg-card hover:bg-border'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 아이콘 그리드 */}
            <div className="grid grid-cols-8 gap-2 max-h-[400px] overflow-y-auto">
              {iconCategories[iconCategory as keyof typeof iconCategories]?.map((iconName) => {
                const IconComponent = iconComponents[iconName];
                if (!IconComponent) return null;
                return (
                  <button
                    key={iconName}
                    onClick={() => addIconElement(iconName)}
                    className="p-3 rounded-lg bg-card hover:bg-border transition-colors flex flex-col items-center gap-1 group"
                    title={iconName}
                  >
                    <IconComponent size={24} />
                    <span className="text-[10px] text-muted group-hover:text-foreground truncate w-full text-center">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 도형 피커 모달 */}
      {showShapePicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShapePicker(false)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-xl shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">도형 선택</h3>
              <button onClick={() => setShowShapePicker(false)} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {(Object.keys(shapeLabels) as ShapeType[]).map((shapeType) => (
                <button
                  key={shapeType}
                  onClick={() => {
                    if (selectedElement) {
                      const selectedEl = currentSlide?.elements.find(e => e.id === selectedElement);
                      if (selectedEl?.type === 'shape') {
                        updateElement(selectedElement, { content: shapeType });
                        setShowShapePicker(false);
                        return;
                      }
                    }
                    addShapeElement(shapeType);
                  }}
                  className="p-3 rounded-lg bg-card hover:bg-border transition-colors flex flex-col items-center gap-2"
                >
                  {shapeType === 'heart' ? (
                    <svg viewBox="0 0 24 24" className="w-10 h-10">
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill="#ef4444"
                      />
                    </svg>
                  ) : shapeType === 'line' ? (
                    <div className="w-10 h-10 flex items-center justify-center">
                      <div className="w-full h-1 bg-blue-500 rounded" />
                    </div>
                  ) : (
                    <div
                      className="w-10 h-10"
                      style={{
                        backgroundColor: '#3b82f6',
                        borderRadius: shapeType === 'circle' ? '50%'
                          : shapeType === 'rounded-rectangle' ? '8px'
                          : shapeType === 'oval' ? '50%'
                          : shapeType === 'rectangle' ? '4px'
                          : '0',
                        clipPath: shapeClipPaths[shapeType] || 'none',
                      }}
                    />
                  )}
                  <span className="text-xs text-muted text-center">{shapeLabels[shapeType]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
