//#include <required.glsl> // [HACK 4/6/2023] See SCC shader_merger.cpp
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// NGS_FLAG_IS_NORMAL_MAP normalTex
// NGS_FLAG_IS_NORMAL_MAP detailNormalTex
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//sampler sampler baseTexSmpSC 0:24
//sampler sampler detailNormalTexSmpSC 0:25
//sampler sampler emissiveTexSmpSC 0:26
//sampler sampler intensityTextureSmpSC 0:27
//sampler sampler materialParamsTexSmpSC 0:28
//sampler sampler normalTexSmpSC 0:29
//sampler sampler opacityTexSmpSC 0:30
//sampler sampler reflectionModulationTexSmpSC 0:31
//sampler sampler reflectionTexSmpSC 0:32
//sampler sampler rimColorTexSmpSC 0:33
//sampler sampler sc_EnvmapDiffuseSmpSC 0:34
//sampler sampler sc_EnvmapSpecularSmpSC 0:35
//sampler sampler sc_OITCommonSampler 0:36
//sampler sampler sc_SSAOTextureSmpSC 0:37
//sampler sampler sc_ScreenTextureSmpSC 0:38
//sampler sampler sc_ShadowTextureSmpSC 0:39
//texture texture2D baseTex 0:0:0:24
//texture texture2D detailNormalTex 0:1:0:25
//texture texture2D emissiveTex 0:2:0:26
//texture texture2D intensityTexture 0:3:0:27
//texture texture2D materialParamsTex 0:4:0:28
//texture texture2D normalTex 0:5:0:29
//texture texture2D opacityTex 0:6:0:30
//texture texture2D reflectionModulationTex 0:7:0:31
//texture texture2D reflectionTex 0:8:0:32
//texture texture2D rimColorTex 0:9:0:33
//texture texture2D sc_EnvmapDiffuse 0:10:0:34
//texture texture2D sc_EnvmapSpecular 0:11:0:35
//texture texture2D sc_OITAlpha0 0:12:0:36
//texture texture2D sc_OITAlpha1 0:13:0:36
//texture texture2D sc_OITDepthHigh0 0:14:0:36
//texture texture2D sc_OITDepthHigh1 0:15:0:36
//texture texture2D sc_OITDepthLow0 0:16:0:36
//texture texture2D sc_OITDepthLow1 0:17:0:36
//texture texture2D sc_OITFilteredDepthBoundsTexture 0:18:0:36
//texture texture2D sc_OITFrontDepthTexture 0:19:0:36
//texture texture2D sc_SSAOTexture 0:20:0:37
//texture texture2D sc_ScreenTexture 0:21:0:38
//texture texture2D sc_ShadowTexture 0:22:0:39
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR 2 0
//spec_const bool BLEND_MODE_COLOR_BURN 3 0
//spec_const bool BLEND_MODE_COLOR_DODGE 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_baseTex 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_detailNormalTex 32 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_emissiveTex 33 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 34 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_materialParamsTex 35 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_normalTex 36 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_opacityTex 37 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_reflectionModulationTex 38 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_reflectionTex 39 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_rimColorTex 40 0
//spec_const bool SC_USE_UV_MIN_MAX_baseTex 41 0
//spec_const bool SC_USE_UV_MIN_MAX_detailNormalTex 42 0
//spec_const bool SC_USE_UV_MIN_MAX_emissiveTex 43 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 44 0
//spec_const bool SC_USE_UV_MIN_MAX_materialParamsTex 45 0
//spec_const bool SC_USE_UV_MIN_MAX_normalTex 46 0
//spec_const bool SC_USE_UV_MIN_MAX_opacityTex 47 0
//spec_const bool SC_USE_UV_MIN_MAX_reflectionModulationTex 48 0
//spec_const bool SC_USE_UV_MIN_MAX_reflectionTex 49 0
//spec_const bool SC_USE_UV_MIN_MAX_rimColorTex 50 0
//spec_const bool SC_USE_UV_TRANSFORM_baseTex 51 0
//spec_const bool SC_USE_UV_TRANSFORM_detailNormalTex 52 0
//spec_const bool SC_USE_UV_TRANSFORM_emissiveTex 53 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 54 0
//spec_const bool SC_USE_UV_TRANSFORM_materialParamsTex 55 0
//spec_const bool SC_USE_UV_TRANSFORM_normalTex 56 0
//spec_const bool SC_USE_UV_TRANSFORM_opacityTex 57 0
//spec_const bool SC_USE_UV_TRANSFORM_reflectionModulationTex 58 0
//spec_const bool SC_USE_UV_TRANSFORM_reflectionTex 59 0
//spec_const bool SC_USE_UV_TRANSFORM_rimColorTex 60 0
//spec_const bool Tweak_N11 61 0
//spec_const bool Tweak_N121 62 0
//spec_const bool Tweak_N177 63 0
//spec_const bool Tweak_N179 64 0
//spec_const bool Tweak_N216 65 0
//spec_const bool Tweak_N218 66 0
//spec_const bool Tweak_N219 67 0
//spec_const bool Tweak_N223 68 0
//spec_const bool Tweak_N308 69 0
//spec_const bool Tweak_N354 70 0
//spec_const bool Tweak_N37 71 0
//spec_const bool Tweak_N67 72 0
//spec_const bool Tweak_N74 73 0
//spec_const bool UseViewSpaceDepthVariant 74 1
//spec_const bool baseTexHasSwappedViews 75 0
//spec_const bool detailNormalTexHasSwappedViews 76 0
//spec_const bool emissiveTexHasSwappedViews 77 0
//spec_const bool intensityTextureHasSwappedViews 78 0
//spec_const bool materialParamsTexHasSwappedViews 79 0
//spec_const bool normalTexHasSwappedViews 80 0
//spec_const bool opacityTexHasSwappedViews 81 0
//spec_const bool reflectionModulationTexHasSwappedViews 82 0
//spec_const bool reflectionTexHasSwappedViews 83 0
//spec_const bool rimColorTexHasSwappedViews 84 0
//spec_const bool rimInvert 85 0
//spec_const bool sc_BlendMode_Add 86 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 87 0
//spec_const bool sc_BlendMode_AlphaTest 88 0
//spec_const bool sc_BlendMode_AlphaToCoverage 89 0
//spec_const bool sc_BlendMode_ColoredGlass 90 0
//spec_const bool sc_BlendMode_Custom 91 0
//spec_const bool sc_BlendMode_Max 92 0
//spec_const bool sc_BlendMode_Min 93 0
//spec_const bool sc_BlendMode_Multiply 94 0
//spec_const bool sc_BlendMode_MultiplyOriginal 95 0
//spec_const bool sc_BlendMode_Normal 96 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 97 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 98 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 99 0
//spec_const bool sc_BlendMode_Screen 100 0
//spec_const bool sc_DepthOnly 101 0
//spec_const bool sc_EnvmapDiffuseHasSwappedViews 102 0
//spec_const bool sc_EnvmapSpecularHasSwappedViews 103 0
//spec_const bool sc_FramebufferFetch 104 0
//spec_const bool sc_HasDiffuseEnvmap 105 0
//spec_const bool sc_IsEditor 106 0
//spec_const bool sc_LightEstimation 107 0
//spec_const bool sc_MotionVectorsPass 108 0
//spec_const bool sc_OITCompositingPass 109 0
//spec_const bool sc_OITDepthBoundsPass 110 0
//spec_const bool sc_OITDepthGatherPass 111 0
//spec_const bool sc_OITDepthPrepass 112 0
//spec_const bool sc_OITFrontLayerPass 113 0
//spec_const bool sc_OITMaxLayers4Plus1 114 0
//spec_const bool sc_OITMaxLayers8 115 0
//spec_const bool sc_OITMaxLayersVisualizeLayerCount 116 0
//spec_const bool sc_OutputBounds 117 0
//spec_const bool sc_ProjectiveShadowsCaster 118 0
//spec_const bool sc_ProjectiveShadowsReceiver 119 0
//spec_const bool sc_RenderAlphaToColor 120 0
//spec_const bool sc_SSAOEnabled 121 0
//spec_const bool sc_ScreenTextureHasSwappedViews 122 0
//spec_const bool sc_TAAEnabled 123 0
//spec_const bool sc_VertexBlending 124 0
//spec_const bool sc_VertexBlendingUseNormals 125 0
//spec_const bool sc_Voxelization 126 0
//spec_const bool uv2EnableAnimation 127 0
//spec_const bool uv3EnableAnimation 128 0
//spec_const int NODE_13_DROPLIST_ITEM 129 0
//spec_const int NODE_181_DROPLIST_ITEM 130 0
//spec_const int NODE_184_DROPLIST_ITEM 131 0
//spec_const int NODE_221_DROPLIST_ITEM 132 0
//spec_const int NODE_228_DROPLIST_ITEM 133 0
//spec_const int NODE_27_DROPLIST_ITEM 134 0
//spec_const int NODE_315_DROPLIST_ITEM 135 0
//spec_const int NODE_38_DROPLIST_ITEM 136 0
//spec_const int NODE_49_DROPLIST_ITEM 137 0
//spec_const int NODE_69_DROPLIST_ITEM 138 0
//spec_const int NODE_76_DROPLIST_ITEM 139 0
//spec_const int SC_DEVICE_CLASS 140 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_baseTex 141 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_detailNormalTex 142 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_emissiveTex 143 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 144 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_materialParamsTex 145 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_normalTex 146 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_opacityTex 147 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex 148 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_reflectionTex 149 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_rimColorTex 150 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_baseTex 151 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_detailNormalTex 152 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_emissiveTex 153 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 154 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_materialParamsTex 155 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_normalTex 156 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_opacityTex 157 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex 158 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_reflectionTex 159 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_rimColorTex 160 -1
//spec_const int baseTexLayout 161 0
//spec_const int detailNormalTexLayout 162 0
//spec_const int emissiveTexLayout 163 0
//spec_const int intensityTextureLayout 164 0
//spec_const int materialParamsTexLayout 165 0
//spec_const int normalTexLayout 166 0
//spec_const int opacityTexLayout 167 0
//spec_const int reflectionModulationTexLayout 168 0
//spec_const int reflectionTexLayout 169 0
//spec_const int rimColorTexLayout 170 0
//spec_const int sc_AmbientLightMode0 171 0
//spec_const int sc_AmbientLightMode1 172 0
//spec_const int sc_AmbientLightMode2 173 0
//spec_const int sc_AmbientLightMode_Constant 174 0
//spec_const int sc_AmbientLightMode_EnvironmentMap 175 0
//spec_const int sc_AmbientLightMode_FromCamera 176 0
//spec_const int sc_AmbientLightMode_SphericalHarmonics 177 0
//spec_const int sc_AmbientLightsCount 178 0
//spec_const int sc_DepthBufferMode 179 0
//spec_const int sc_DirectionalLightsCount 180 0
//spec_const int sc_EnvLightMode 181 0
//spec_const int sc_EnvmapDiffuseLayout 182 0
//spec_const int sc_EnvmapSpecularLayout 183 0
//spec_const int sc_LightEstimationSGCount 184 0
//spec_const int sc_PointLightsCount 185 0
//spec_const int sc_RenderingSpace 186 -1
//spec_const int sc_ScreenTextureLayout 187 0
//spec_const int sc_ShaderCacheConstant 188 0
//spec_const int sc_SkinBonesCount 189 0
//spec_const int sc_StereoRenderingMode 190 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 191 0
//spec_const int sc_StereoViewID 192 0
//SG_REFLECTION_END
#define sc_StereoRendering_Disabled 0
#define sc_StereoRendering_InstancedClipped 1
#define sc_StereoRendering_Multiview 2
#ifdef VERTEX_SHADER
#define scOutPos(clipPosition) gl_Position=clipPosition
#define MAIN main
#endif
#ifdef SC_ENABLE_INSTANCED_RENDERING
#ifndef sc_EnableInstancing
#define sc_EnableInstancing 1
#endif
#endif
#define mod(x,y) (x-y*floor((x+1e-6)/y))
#if __VERSION__<300
#define isinf(x) (x!=0.0&&x*2.0==x ? true : false)
#define isnan(x) (x>0.0||x<0.0||x==0.0 ? false : true)
#define inverse(M) M
#endif
#ifdef sc_EnableStereoClipDistance
#if defined(GL_APPLE_clip_distance)
#extension GL_APPLE_clip_distance : require
#elif defined(GL_EXT_clip_cull_distance)
#extension GL_EXT_clip_cull_distance : require
#else
#error Clip distance is requested but not supported by this device.
#endif
#endif
#ifdef sc_EnableMultiviewStereoRendering
#define sc_StereoRenderingMode sc_StereoRendering_Multiview
#define sc_NumStereoViews 2
#extension GL_OVR_multiview2 : require
#ifdef VERTEX_SHADER
#ifdef sc_EnableInstancingFallback
#define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
#else
#define sc_GlobalInstanceID gl_InstanceID
#endif
#define sc_LocalInstanceID sc_GlobalInstanceID
#define sc_StereoViewID int(gl_ViewID_OVR)
#endif
#elif defined(sc_EnableInstancedClippedStereoRendering)
#ifndef sc_EnableInstancing
#error Instanced-clipped stereo rendering requires enabled instancing.
#endif
#ifndef sc_EnableStereoClipDistance
#define sc_StereoRendering_IsClipDistanceEnabled 0
#else
#define sc_StereoRendering_IsClipDistanceEnabled 1
#endif
#define sc_StereoRenderingMode sc_StereoRendering_InstancedClipped
#define sc_NumStereoClipPlanes 1
#define sc_NumStereoViews 2
#ifdef VERTEX_SHADER
#ifdef sc_EnableInstancingFallback
#define sc_GlobalInstanceID (sc_FallbackInstanceID*2+gl_InstanceID)
#else
#define sc_GlobalInstanceID gl_InstanceID
#endif
#define sc_LocalInstanceID (sc_GlobalInstanceID/2)
#define sc_StereoViewID (sc_GlobalInstanceID%2)
#endif
#else
#define sc_StereoRenderingMode sc_StereoRendering_Disabled
#endif
#if defined(sc_EnableInstancing)&&defined(VERTEX_SHADER)
#ifdef GL_ARB_draw_instanced
#extension GL_ARB_draw_instanced : require
#define gl_InstanceID gl_InstanceIDARB
#endif
#ifdef GL_EXT_draw_instanced
#extension GL_EXT_draw_instanced : require
#define gl_InstanceID gl_InstanceIDEXT
#endif
#ifndef sc_InstanceID
#define sc_InstanceID gl_InstanceID
#endif
#ifndef sc_GlobalInstanceID
#ifdef sc_EnableInstancingFallback
#define sc_GlobalInstanceID (sc_FallbackInstanceID)
#define sc_LocalInstanceID (sc_FallbackInstanceID)
#else
#define sc_GlobalInstanceID gl_InstanceID
#define sc_LocalInstanceID gl_InstanceID
#endif
#endif
#endif
#ifndef GL_ES
#extension GL_EXT_gpu_shader4 : enable
#extension GL_ARB_shader_texture_lod : enable
#define precision
#define lowp
#define mediump
#define highp
#define sc_FragmentPrecision
#endif
#ifdef GL_ES
#ifdef sc_FramebufferFetch
#if defined(GL_EXT_shader_framebuffer_fetch)
#extension GL_EXT_shader_framebuffer_fetch : require
#elif defined(GL_ARM_shader_framebuffer_fetch)
#extension GL_ARM_shader_framebuffer_fetch : require
#else
#error Framebuffer fetch is requested but not supported by this device.
#endif
#endif
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define sc_FragmentPrecision highp
#else
#define sc_FragmentPrecision mediump
#endif
#ifdef FRAGMENT_SHADER
precision highp int;
precision highp float;
#endif
#endif
#ifdef VERTEX_SHADER
#ifdef sc_EnableMultiviewStereoRendering
layout(num_views=sc_NumStereoViews) in;
#endif
#endif
#define SC_INT_FALLBACK_FLOAT int
#define SC_INTERPOLATION_FLAT flat
#define SC_INTERPOLATION_CENTROID centroid
#ifndef sc_NumStereoViews
#define sc_NumStereoViews 1
#endif
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
#if defined VERTEX_SHADER
struct sc_Vertex_t
{
vec4 position;
vec3 normal;
vec3 tangent;
vec2 texture0;
vec2 texture1;
};
#ifndef sc_StereoRenderingMode
#define sc_StereoRenderingMode 0
#endif
#ifndef sc_StereoViewID
#define sc_StereoViewID 0
#endif
#ifndef sc_RenderingSpace
#define sc_RenderingSpace -1
#endif
#ifndef sc_TAAEnabled
#define sc_TAAEnabled 0
#elif sc_TAAEnabled==1
#undef sc_TAAEnabled
#define sc_TAAEnabled 1
#endif
#ifndef sc_StereoRendering_IsClipDistanceEnabled
#define sc_StereoRendering_IsClipDistanceEnabled 0
#endif
#ifndef sc_NumStereoViews
#define sc_NumStereoViews 1
#endif
#ifndef sc_ShaderCacheConstant
#define sc_ShaderCacheConstant 0
#endif
#ifndef sc_SkinBonesCount
#define sc_SkinBonesCount 0
#endif
#ifndef sc_VertexBlending
#define sc_VertexBlending 0
#elif sc_VertexBlending==1
#undef sc_VertexBlending
#define sc_VertexBlending 1
#endif
#ifndef sc_VertexBlendingUseNormals
#define sc_VertexBlendingUseNormals 0
#elif sc_VertexBlendingUseNormals==1
#undef sc_VertexBlendingUseNormals
#define sc_VertexBlendingUseNormals 1
#endif
struct sc_Camera_t
{
vec3 position;
float aspect;
vec2 clipPlanes;
};
#ifndef sc_DepthBufferMode
#define sc_DepthBufferMode 0
#endif
#ifndef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 0
#elif sc_ProjectiveShadowsReceiver==1
#undef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 1
#endif
#ifndef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 0
#elif sc_OITDepthGatherPass==1
#undef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 1
#endif
#ifndef sc_OITCompositingPass
#define sc_OITCompositingPass 0
#elif sc_OITCompositingPass==1
#undef sc_OITCompositingPass
#define sc_OITCompositingPass 1
#endif
#ifndef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 0
#elif sc_OITDepthBoundsPass==1
#undef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 1
#endif
#ifndef sc_Voxelization
#define sc_Voxelization 0
#elif sc_Voxelization==1
#undef sc_Voxelization
#define sc_Voxelization 1
#endif
#ifndef UseViewSpaceDepthVariant
#define UseViewSpaceDepthVariant 1
#elif UseViewSpaceDepthVariant==1
#undef UseViewSpaceDepthVariant
#define UseViewSpaceDepthVariant 1
#endif
#ifndef sc_OutputBounds
#define sc_OutputBounds 0
#elif sc_OutputBounds==1
#undef sc_OutputBounds
#define sc_OutputBounds 1
#endif
uniform mat4 sc_ModelMatrix;
uniform mat4 sc_ProjectorMatrix;
uniform vec2 sc_TAAJitterOffset;
uniform int sc_FallbackInstanceID;
uniform vec4 sc_StereoClipPlanes[sc_NumStereoViews];
uniform vec4 sc_UniformConstants;
uniform vec4 sc_BoneMatrices[((sc_SkinBonesCount*3)+1)];
uniform mat3 sc_SkinBonesNormalMatrices[(sc_SkinBonesCount+1)];
uniform vec4 weights0;
uniform vec4 weights1;
uniform mat4 sc_ViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ModelViewMatrixArray[sc_NumStereoViews];
uniform sc_Camera_t sc_Camera;
uniform mat4 sc_ProjectionMatrixInverseArray[sc_NumStereoViews];
uniform mat4 sc_ViewMatrixArray[sc_NumStereoViews];
uniform mat4 sc_ProjectionMatrixArray[sc_NumStereoViews];
uniform mat3 sc_NormalMatrix;
uniform vec4 voxelization_params_0;
uniform vec4 voxelization_params_frustum_lrbt;
uniform vec4 voxelization_params_frustum_nf;
uniform vec3 voxelization_params_camera_pos;
uniform mat4 sc_ModelMatrixVoxelization;
uniform int PreviewEnabled;
varying float varClipDistance;
varying float varStereoViewID;
attribute vec4 boneData;
attribute vec3 blendShape0Pos;
attribute vec3 blendShape0Normal;
attribute vec3 blendShape1Pos;
attribute vec3 blendShape1Normal;
attribute vec3 blendShape2Pos;
attribute vec3 blendShape2Normal;
attribute vec3 blendShape3Pos;
attribute vec3 blendShape4Pos;
attribute vec3 blendShape5Pos;
attribute vec4 position;
attribute vec3 normal;
attribute vec4 tangent;
attribute vec2 texture0;
attribute vec2 texture1;
varying vec3 varPos;
varying vec3 varNormal;
varying vec4 varTangent;
varying vec4 varPackedTex;
varying vec4 varScreenPos;
varying vec2 varScreenTexturePos;
varying vec2 varShadowTex;
varying float varViewSpaceDepth;
varying vec4 varColor;
attribute vec4 color;
varying vec4 PreviewVertexColor;
varying float PreviewVertexSaved;
attribute vec3 positionNext;
attribute vec3 positionPrevious;
attribute vec4 strandProperties;
int sc_GetLocalInstanceIDInternal(int id)
{
#ifdef sc_LocalInstanceID
return sc_LocalInstanceID;
#else
return 0;
#endif
}
void blendTargetShapeWithNormal(inout sc_Vertex_t v,vec3 position_1,vec3 normal_1,float weight)
{
vec3 l9_0=v.position.xyz+(position_1*weight);
v=sc_Vertex_t(vec4(l9_0.x,l9_0.y,l9_0.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
v.normal+=(normal_1*weight);
}
void sc_BlendVertex(inout sc_Vertex_t v)
{
#if (sc_VertexBlending)
{
#if (sc_VertexBlendingUseNormals)
{
blendTargetShapeWithNormal(v,blendShape0Pos,blendShape0Normal,weights0.x);
blendTargetShapeWithNormal(v,blendShape1Pos,blendShape1Normal,weights0.y);
blendTargetShapeWithNormal(v,blendShape2Pos,blendShape2Normal,weights0.z);
}
#else
{
vec3 l9_0=v.position.xyz+(blendShape0Pos*weights0.x);
v=sc_Vertex_t(vec4(l9_0.x,l9_0.y,l9_0.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_1=v.position.xyz+(blendShape1Pos*weights0.y);
v=sc_Vertex_t(vec4(l9_1.x,l9_1.y,l9_1.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_2=v.position.xyz+(blendShape2Pos*weights0.z);
v=sc_Vertex_t(vec4(l9_2.x,l9_2.y,l9_2.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_3=v.position.xyz+(blendShape3Pos*weights0.w);
v=sc_Vertex_t(vec4(l9_3.x,l9_3.y,l9_3.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_4=v.position.xyz+(blendShape4Pos*weights1.x);
v=sc_Vertex_t(vec4(l9_4.x,l9_4.y,l9_4.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
vec3 l9_5=v.position.xyz+(blendShape5Pos*weights1.y);
v=sc_Vertex_t(vec4(l9_5.x,l9_5.y,l9_5.z,v.position.w),v.normal,v.tangent,v.texture0,v.texture1);
}
#endif
}
#endif
}
vec4 sc_GetBoneWeights()
{
vec4 l9_0;
#if (sc_SkinBonesCount>0)
{
vec4 l9_1=vec4(1.0,fract(boneData.yzw));
vec4 l9_2=l9_1;
l9_2.x=1.0-dot(l9_1.yzw,vec3(1.0));
l9_0=l9_2;
}
#else
{
l9_0=vec4(0.0);
}
#endif
return l9_0;
}
void sc_GetBoneMatrix(int index,out vec4 m0,out vec4 m1,out vec4 m2)
{
int l9_0=3*index;
m0=sc_BoneMatrices[l9_0];
m1=sc_BoneMatrices[l9_0+1];
m2=sc_BoneMatrices[l9_0+2];
}
vec3 skinVertexPosition(int i,vec4 v)
{
vec3 l9_0;
#if (sc_SkinBonesCount>0)
{
vec4 param_1;
vec4 param_2;
vec4 param_3;
sc_GetBoneMatrix(i,param_1,param_2,param_3);
l9_0=vec3(dot(v,param_1),dot(v,param_2),dot(v,param_3));
}
#else
{
l9_0=v.xyz;
}
#endif
return l9_0;
}
void sc_SkinVertex(inout sc_Vertex_t v)
{
#if (sc_SkinBonesCount>0)
{
vec4 l9_0=sc_GetBoneWeights();
int l9_1=int(boneData.x);
int l9_2=int(boneData.y);
int l9_3=int(boneData.z);
int l9_4=int(boneData.w);
float l9_5=l9_0.x;
float l9_6=l9_0.y;
float l9_7=l9_0.z;
float l9_8=l9_0.w;
vec3 l9_9=(((skinVertexPosition(l9_1,v.position)*l9_5)+(skinVertexPosition(l9_2,v.position)*l9_6))+(skinVertexPosition(l9_3,v.position)*l9_7))+(skinVertexPosition(l9_4,v.position)*l9_8);
v.position=vec4(l9_9.x,l9_9.y,l9_9.z,v.position.w);
v.normal=((((sc_SkinBonesNormalMatrices[l9_1]*v.normal)*l9_5)+((sc_SkinBonesNormalMatrices[l9_2]*v.normal)*l9_6))+((sc_SkinBonesNormalMatrices[l9_3]*v.normal)*l9_7))+((sc_SkinBonesNormalMatrices[l9_4]*v.normal)*l9_8);
v.tangent=((((sc_SkinBonesNormalMatrices[l9_1]*v.tangent)*l9_5)+((sc_SkinBonesNormalMatrices[l9_2]*v.tangent)*l9_6))+((sc_SkinBonesNormalMatrices[l9_3]*v.tangent)*l9_7))+((sc_SkinBonesNormalMatrices[l9_4]*v.tangent)*l9_8);
}
#endif
}
int sc_GetStereoViewIndex()
{
int l9_0;
#if (sc_StereoRenderingMode==0)
{
l9_0=0;
}
#else
{
l9_0=sc_StereoViewID;
}
#endif
return l9_0;
}
void sc_SetClipDistancePlatform(float dstClipDistance)
{
#if sc_StereoRenderingMode==sc_StereoRendering_InstancedClipped&&sc_StereoRendering_IsClipDistanceEnabled
gl_ClipDistance[0]=dstClipDistance;
#endif
}
void sc_SetClipDistance(float dstClipDistance)
{
#if (sc_StereoRendering_IsClipDistanceEnabled==1)
{
sc_SetClipDistancePlatform(dstClipDistance);
}
#else
{
varClipDistance=dstClipDistance;
}
#endif
}
void sc_SetClipDistance(vec4 clipPosition)
{
#if (sc_StereoRenderingMode==1)
{
sc_SetClipDistance(dot(clipPosition,sc_StereoClipPlanes[sc_StereoViewID]));
}
#endif
}
void sc_SetClipPosition(vec4 clipPosition)
{
#if (sc_ShaderCacheConstant!=0)
{
clipPosition.x+=(sc_UniformConstants.x*float(sc_ShaderCacheConstant));
}
#endif
#if (sc_StereoRenderingMode>0)
{
varStereoViewID=float(sc_StereoViewID);
}
#endif
sc_SetClipDistance(clipPosition);
gl_Position=clipPosition;
}
mat4 createVoxelOrthoMatrix(float left,float right,float bottom,float top,float near,float far)
{
return mat4(vec4(2.0/(right-left),0.0,0.0,(-(right+left))/(right-left)),vec4(0.0,2.0/(top-bottom),0.0,(-(top+bottom))/(top-bottom)),vec4(0.0,0.0,(-2.0)/(far-near),(-(far+near))/(far-near)),vec4(0.0,0.0,0.0,1.0));
}
void main()
{
PreviewVertexColor=vec4(0.5);
PreviewVertexSaved=0.0;
sc_Vertex_t l9_0=sc_Vertex_t(position,normal,tangent.xyz,texture0,texture1);
sc_BlendVertex(l9_0);
sc_SkinVertex(l9_0);
#if (sc_RenderingSpace==3)
{
varPos=vec3(0.0);
varNormal=l9_0.normal;
varTangent=vec4(l9_0.tangent.x,l9_0.tangent.y,l9_0.tangent.z,varTangent.w);
}
#else
{
#if (sc_RenderingSpace==4)
{
varPos=vec3(0.0);
varNormal=l9_0.normal;
varTangent=vec4(l9_0.tangent.x,l9_0.tangent.y,l9_0.tangent.z,varTangent.w);
}
#else
{
#if (sc_RenderingSpace==2)
{
varPos=l9_0.position.xyz;
varNormal=l9_0.normal;
varTangent=vec4(l9_0.tangent.x,l9_0.tangent.y,l9_0.tangent.z,varTangent.w);
}
#else
{
#if (sc_RenderingSpace==1)
{
varPos=(sc_ModelMatrix*l9_0.position).xyz;
varNormal=sc_NormalMatrix*l9_0.normal;
vec3 l9_1=sc_NormalMatrix*l9_0.tangent;
varTangent=vec4(l9_1.x,l9_1.y,l9_1.z,varTangent.w);
}
#endif
}
#endif
}
#endif
}
#endif
bool l9_2=PreviewEnabled==1;
vec2 l9_3;
if (l9_2)
{
vec2 l9_4=l9_0.texture0;
l9_4.x=1.0-l9_0.texture0.x;
l9_3=l9_4;
}
else
{
l9_3=l9_0.texture0;
}
varColor=color;
vec3 l9_5=varPos;
vec3 l9_6=varNormal;
vec3 l9_7;
vec3 l9_8;
vec3 l9_9;
if (l9_2)
{
l9_9=varTangent.xyz;
l9_8=varNormal;
l9_7=varPos;
}
else
{
l9_9=varTangent.xyz;
l9_8=l9_6;
l9_7=l9_5;
}
varPos=l9_7;
varNormal=normalize(l9_8);
vec3 l9_10=normalize(l9_9);
varTangent=vec4(l9_10.x,l9_10.y,l9_10.z,varTangent.w);
varTangent.w=tangent.w;
#if (UseViewSpaceDepthVariant&&((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass))
{
vec4 l9_11;
#if (sc_RenderingSpace==3)
{
l9_11=sc_ProjectionMatrixInverseArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
vec4 l9_12;
#if (sc_RenderingSpace==2)
{
l9_12=sc_ViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
vec4 l9_13;
#if (sc_RenderingSpace==1)
{
l9_13=sc_ModelViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
l9_13=l9_0.position;
}
#endif
l9_12=l9_13;
}
#endif
l9_11=l9_12;
}
#endif
varViewSpaceDepth=-l9_11.z;
}
#endif
vec4 l9_14;
#if (sc_RenderingSpace==3)
{
l9_14=l9_0.position;
}
#else
{
vec4 l9_15;
#if (sc_RenderingSpace==4)
{
l9_15=(sc_ModelViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position)*vec4(1.0/sc_Camera.aspect,1.0,1.0,1.0);
}
#else
{
vec4 l9_16;
#if (sc_RenderingSpace==2)
{
l9_16=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
}
#else
{
vec4 l9_17;
#if (sc_RenderingSpace==1)
{
l9_17=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
}
#else
{
l9_17=vec4(0.0);
}
#endif
l9_16=l9_17;
}
#endif
l9_15=l9_16;
}
#endif
l9_14=l9_15;
}
#endif
varPackedTex=vec4(l9_3,l9_0.texture1);
#if (sc_ProjectiveShadowsReceiver)
{
vec4 l9_18;
#if (sc_RenderingSpace==1)
{
l9_18=sc_ModelMatrix*l9_0.position;
}
#else
{
l9_18=l9_0.position;
}
#endif
vec4 l9_19=sc_ProjectorMatrix*l9_18;
varShadowTex=((l9_19.xy/vec2(l9_19.w))*0.5)+vec2(0.5);
}
#endif
vec4 l9_20;
#if (sc_DepthBufferMode==1)
{
vec4 l9_21;
if (sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][2].w!=0.0)
{
vec4 l9_22=l9_14;
l9_22.z=((log2(max(sc_Camera.clipPlanes.x,1.0+l9_14.w))*(2.0/log2(sc_Camera.clipPlanes.y+1.0)))-1.0)*l9_14.w;
l9_21=l9_22;
}
else
{
l9_21=l9_14;
}
l9_20=l9_21;
}
#else
{
l9_20=l9_14;
}
#endif
vec4 l9_23;
#if (sc_TAAEnabled)
{
vec2 l9_24=l9_20.xy+(sc_TAAJitterOffset*l9_20.w);
l9_23=vec4(l9_24.x,l9_24.y,l9_20.z,l9_20.w);
}
#else
{
l9_23=l9_20;
}
#endif
sc_SetClipPosition(l9_23);
#if (sc_Voxelization)
{
sc_Vertex_t l9_25=sc_Vertex_t(l9_0.position,l9_0.normal,l9_0.tangent,l9_3,l9_0.texture1);
sc_BlendVertex(l9_25);
sc_SkinVertex(l9_25);
int l9_26=sc_GetLocalInstanceIDInternal(sc_FallbackInstanceID);
int l9_27=int(voxelization_params_0.w);
vec4 l9_28=createVoxelOrthoMatrix(voxelization_params_frustum_lrbt.x,voxelization_params_frustum_lrbt.y,voxelization_params_frustum_lrbt.z,voxelization_params_frustum_lrbt.w,voxelization_params_frustum_nf.x,voxelization_params_frustum_nf.y)*vec4(((sc_ModelMatrixVoxelization*l9_25.position).xyz+vec3(float(l9_26%l9_27)*voxelization_params_0.y,float(l9_26/l9_27)*voxelization_params_0.y,(float(l9_26)*(voxelization_params_0.y/voxelization_params_0.z))+voxelization_params_frustum_nf.x))-voxelization_params_camera_pos,1.0);
l9_28.w=1.0;
varScreenPos=l9_28;
sc_SetClipPosition(l9_28*1.0);
}
#else
{
#if (sc_OutputBounds)
{
sc_Vertex_t l9_29=sc_Vertex_t(l9_0.position,l9_0.normal,l9_0.tangent,l9_3,l9_0.texture1);
sc_BlendVertex(l9_29);
sc_SkinVertex(l9_29);
vec2 l9_30=((l9_29.position.xy/vec2(l9_29.position.w))*0.5)+vec2(0.5);
varPackedTex=vec4(l9_30.x,l9_30.y,varPackedTex.z,varPackedTex.w);
vec4 l9_31=sc_ModelMatrixVoxelization*l9_29.position;
vec3 l9_32=l9_31.xyz-voxelization_params_camera_pos;
varPos=l9_32.xyz;
varNormal=normalize(l9_29.normal);
vec4 l9_33=createVoxelOrthoMatrix(voxelization_params_frustum_lrbt.x,voxelization_params_frustum_lrbt.y,voxelization_params_frustum_lrbt.z,voxelization_params_frustum_lrbt.w,voxelization_params_frustum_nf.x,voxelization_params_frustum_nf.y)*vec4(l9_32.x,l9_32.y,l9_32.z,l9_31.w);
vec4 l9_34=vec4(l9_33.x,l9_33.y,l9_33.z,vec4(0.0).w);
l9_34.w=1.0;
varScreenPos=l9_34;
sc_SetClipPosition(l9_34*1.0);
}
#endif
}
#endif
}
#elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
#ifndef sc_FramebufferFetch
#define sc_FramebufferFetch 0
#elif sc_FramebufferFetch==1
#undef sc_FramebufferFetch
#define sc_FramebufferFetch 1
#endif
#if defined(GL_ES)||__VERSION__>=420
#if sc_FragDataCount>=1
#define sc_DeclareFragData0(StorageQualifier) layout(location=0) StorageQualifier sc_FragmentPrecision vec4 sc_FragData0
#endif
#if sc_FragDataCount>=2
#define sc_DeclareFragData1(StorageQualifier) layout(location=1) StorageQualifier sc_FragmentPrecision vec4 sc_FragData1
#endif
#if sc_FragDataCount>=3
#define sc_DeclareFragData2(StorageQualifier) layout(location=2) StorageQualifier sc_FragmentPrecision vec4 sc_FragData2
#endif
#if sc_FragDataCount>=4
#define sc_DeclareFragData3(StorageQualifier) layout(location=3) StorageQualifier sc_FragmentPrecision vec4 sc_FragData3
#endif
#ifndef sc_DeclareFragData0
#define sc_DeclareFragData0(_) const vec4 sc_FragData0=vec4(0.0)
#endif
#ifndef sc_DeclareFragData1
#define sc_DeclareFragData1(_) const vec4 sc_FragData1=vec4(0.0)
#endif
#ifndef sc_DeclareFragData2
#define sc_DeclareFragData2(_) const vec4 sc_FragData2=vec4(0.0)
#endif
#ifndef sc_DeclareFragData3
#define sc_DeclareFragData3(_) const vec4 sc_FragData3=vec4(0.0)
#endif
#if sc_FramebufferFetch
#ifdef GL_EXT_shader_framebuffer_fetch
sc_DeclareFragData0(inout);
sc_DeclareFragData1(inout);
sc_DeclareFragData2(inout);
sc_DeclareFragData3(inout);
mediump mat4 getFragData() { return mat4(sc_FragData0,sc_FragData1,sc_FragData2,sc_FragData3); }
#define gl_LastFragData (getFragData())
#elif defined(GL_ARM_shader_framebuffer_fetch)
sc_DeclareFragData0(out);
sc_DeclareFragData1(out);
sc_DeclareFragData2(out);
sc_DeclareFragData3(out);
mediump mat4 getFragData() { return mat4(gl_LastFragColorARM,vec4(0.0),vec4(0.0),vec4(0.0)); }
#define gl_LastFragData (getFragData())
#endif
#else
sc_DeclareFragData0(out);
sc_DeclareFragData1(out);
sc_DeclareFragData2(out);
sc_DeclareFragData3(out);
mediump mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
#define gl_LastFragData (getFragData())
#endif
#else
#ifdef FRAGMENT_SHADER
#define sc_FragData0 gl_FragData[0]
#define sc_FragData1 gl_FragData[1]
#define sc_FragData2 gl_FragData[2]
#define sc_FragData3 gl_FragData[3]
#endif
mat4 getFragData() { return mat4(vec4(0.0),vec4(0.0),vec4(0.0),vec4(0.0)); }
#define gl_LastFragData (getFragData())
#if sc_FramebufferFetch
#error Framebuffer fetch is requested but not supported by this device.
#endif
#endif
struct SurfaceProperties
{
vec3 albedo;
float opacity;
vec3 normal;
vec3 positionWS;
vec3 viewDirWS;
float metallic;
float roughness;
vec3 emissive;
vec3 ao;
vec3 specularAo;
vec3 bakedShadows;
vec3 specColor;
};
struct LightingComponents
{
vec3 directDiffuse;
vec3 directSpecular;
vec3 indirectDiffuse;
vec3 indirectSpecular;
vec3 emitted;
vec3 transmitted;
};
struct LightProperties
{
vec3 direction;
vec3 color;
float attenuation;
};
struct sc_SphericalGaussianLight_t
{
vec3 color;
float sharpness;
vec3 axis;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
vec3 BumpedNormal;
vec3 ViewDirWS;
vec3 PositionWS;
vec4 VertexColor;
vec2 Surface_UVCoord0;
vec2 Surface_UVCoord1;
vec2 gScreenCoord;
vec3 VertexTangent_WorldSpace;
vec3 VertexNormal_WorldSpace;
vec3 VertexBinormal_WorldSpace;
vec3 SurfacePosition_WorldSpace;
};
#ifndef sc_StereoRenderingMode
#define sc_StereoRenderingMode 0
#endif
#ifndef sc_EnvmapDiffuseHasSwappedViews
#define sc_EnvmapDiffuseHasSwappedViews 0
#elif sc_EnvmapDiffuseHasSwappedViews==1
#undef sc_EnvmapDiffuseHasSwappedViews
#define sc_EnvmapDiffuseHasSwappedViews 1
#endif
#ifndef sc_EnvmapDiffuseLayout
#define sc_EnvmapDiffuseLayout 0
#endif
#ifndef sc_EnvmapSpecularHasSwappedViews
#define sc_EnvmapSpecularHasSwappedViews 0
#elif sc_EnvmapSpecularHasSwappedViews==1
#undef sc_EnvmapSpecularHasSwappedViews
#define sc_EnvmapSpecularHasSwappedViews 1
#endif
#ifndef sc_EnvmapSpecularLayout
#define sc_EnvmapSpecularLayout 0
#endif
#ifndef sc_ScreenTextureHasSwappedViews
#define sc_ScreenTextureHasSwappedViews 0
#elif sc_ScreenTextureHasSwappedViews==1
#undef sc_ScreenTextureHasSwappedViews
#define sc_ScreenTextureHasSwappedViews 1
#endif
#ifndef sc_ScreenTextureLayout
#define sc_ScreenTextureLayout 0
#endif
#ifndef sc_NumStereoViews
#define sc_NumStereoViews 1
#endif
#ifndef sc_BlendMode_Normal
#define sc_BlendMode_Normal 0
#elif sc_BlendMode_Normal==1
#undef sc_BlendMode_Normal
#define sc_BlendMode_Normal 1
#endif
#ifndef sc_BlendMode_AlphaToCoverage
#define sc_BlendMode_AlphaToCoverage 0
#elif sc_BlendMode_AlphaToCoverage==1
#undef sc_BlendMode_AlphaToCoverage
#define sc_BlendMode_AlphaToCoverage 1
#endif
#ifndef sc_BlendMode_PremultipliedAlphaHardware
#define sc_BlendMode_PremultipliedAlphaHardware 0
#elif sc_BlendMode_PremultipliedAlphaHardware==1
#undef sc_BlendMode_PremultipliedAlphaHardware
#define sc_BlendMode_PremultipliedAlphaHardware 1
#endif
#ifndef sc_BlendMode_PremultipliedAlphaAuto
#define sc_BlendMode_PremultipliedAlphaAuto 0
#elif sc_BlendMode_PremultipliedAlphaAuto==1
#undef sc_BlendMode_PremultipliedAlphaAuto
#define sc_BlendMode_PremultipliedAlphaAuto 1
#endif
#ifndef sc_BlendMode_PremultipliedAlpha
#define sc_BlendMode_PremultipliedAlpha 0
#elif sc_BlendMode_PremultipliedAlpha==1
#undef sc_BlendMode_PremultipliedAlpha
#define sc_BlendMode_PremultipliedAlpha 1
#endif
#ifndef sc_BlendMode_AddWithAlphaFactor
#define sc_BlendMode_AddWithAlphaFactor 0
#elif sc_BlendMode_AddWithAlphaFactor==1
#undef sc_BlendMode_AddWithAlphaFactor
#define sc_BlendMode_AddWithAlphaFactor 1
#endif
#ifndef sc_BlendMode_AlphaTest
#define sc_BlendMode_AlphaTest 0
#elif sc_BlendMode_AlphaTest==1
#undef sc_BlendMode_AlphaTest
#define sc_BlendMode_AlphaTest 1
#endif
#ifndef sc_BlendMode_Multiply
#define sc_BlendMode_Multiply 0
#elif sc_BlendMode_Multiply==1
#undef sc_BlendMode_Multiply
#define sc_BlendMode_Multiply 1
#endif
#ifndef sc_BlendMode_MultiplyOriginal
#define sc_BlendMode_MultiplyOriginal 0
#elif sc_BlendMode_MultiplyOriginal==1
#undef sc_BlendMode_MultiplyOriginal
#define sc_BlendMode_MultiplyOriginal 1
#endif
#ifndef sc_BlendMode_ColoredGlass
#define sc_BlendMode_ColoredGlass 0
#elif sc_BlendMode_ColoredGlass==1
#undef sc_BlendMode_ColoredGlass
#define sc_BlendMode_ColoredGlass 1
#endif
#ifndef sc_BlendMode_Add
#define sc_BlendMode_Add 0
#elif sc_BlendMode_Add==1
#undef sc_BlendMode_Add
#define sc_BlendMode_Add 1
#endif
#ifndef sc_BlendMode_Screen
#define sc_BlendMode_Screen 0
#elif sc_BlendMode_Screen==1
#undef sc_BlendMode_Screen
#define sc_BlendMode_Screen 1
#endif
#ifndef sc_BlendMode_Min
#define sc_BlendMode_Min 0
#elif sc_BlendMode_Min==1
#undef sc_BlendMode_Min
#define sc_BlendMode_Min 1
#endif
#ifndef sc_BlendMode_Max
#define sc_BlendMode_Max 0
#elif sc_BlendMode_Max==1
#undef sc_BlendMode_Max
#define sc_BlendMode_Max 1
#endif
#ifndef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 0
#elif sc_ProjectiveShadowsReceiver==1
#undef sc_ProjectiveShadowsReceiver
#define sc_ProjectiveShadowsReceiver 1
#endif
#ifndef sc_MotionVectorsPass
#define sc_MotionVectorsPass 0
#elif sc_MotionVectorsPass==1
#undef sc_MotionVectorsPass
#define sc_MotionVectorsPass 1
#endif
#ifndef sc_StereoRendering_IsClipDistanceEnabled
#define sc_StereoRendering_IsClipDistanceEnabled 0
#endif
#ifndef sc_ShaderCacheConstant
#define sc_ShaderCacheConstant 0
#endif
#ifndef sc_FramebufferFetch
#define sc_FramebufferFetch 0
#elif sc_FramebufferFetch==1
#undef sc_FramebufferFetch
#define sc_FramebufferFetch 1
#endif
#ifndef sc_SSAOEnabled
#define sc_SSAOEnabled 0
#elif sc_SSAOEnabled==1
#undef sc_SSAOEnabled
#define sc_SSAOEnabled 1
#endif
#ifndef SC_DEVICE_CLASS
#define SC_DEVICE_CLASS -1
#endif
#ifndef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 0
#elif intensityTextureHasSwappedViews==1
#undef intensityTextureHasSwappedViews
#define intensityTextureHasSwappedViews 1
#endif
#ifndef intensityTextureLayout
#define intensityTextureLayout 0
#endif
#ifndef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 0
#elif BLEND_MODE_REALISTIC==1
#undef BLEND_MODE_REALISTIC
#define BLEND_MODE_REALISTIC 1
#endif
#ifndef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 0
#elif BLEND_MODE_FORGRAY==1
#undef BLEND_MODE_FORGRAY
#define BLEND_MODE_FORGRAY 1
#endif
#ifndef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 0
#elif BLEND_MODE_NOTBRIGHT==1
#undef BLEND_MODE_NOTBRIGHT
#define BLEND_MODE_NOTBRIGHT 1
#endif
#ifndef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 0
#elif BLEND_MODE_DIVISION==1
#undef BLEND_MODE_DIVISION
#define BLEND_MODE_DIVISION 1
#endif
#ifndef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 0
#elif BLEND_MODE_BRIGHT==1
#undef BLEND_MODE_BRIGHT
#define BLEND_MODE_BRIGHT 1
#endif
#ifndef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 0
#elif BLEND_MODE_INTENSE==1
#undef BLEND_MODE_INTENSE
#define BLEND_MODE_INTENSE 1
#endif
#ifndef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 0
#elif SC_USE_UV_TRANSFORM_intensityTexture==1
#undef SC_USE_UV_TRANSFORM_intensityTexture
#define SC_USE_UV_TRANSFORM_intensityTexture 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_U_intensityTexture -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_intensityTexture
#define SC_SOFTWARE_WRAP_MODE_V_intensityTexture -1
#endif
#ifndef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 0
#elif SC_USE_UV_MIN_MAX_intensityTexture==1
#undef SC_USE_UV_MIN_MAX_intensityTexture
#define SC_USE_UV_MIN_MAX_intensityTexture 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 0
#elif SC_USE_CLAMP_TO_BORDER_intensityTexture==1
#undef SC_USE_CLAMP_TO_BORDER_intensityTexture
#define SC_USE_CLAMP_TO_BORDER_intensityTexture 1
#endif
#ifndef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 0
#elif BLEND_MODE_LIGHTEN==1
#undef BLEND_MODE_LIGHTEN
#define BLEND_MODE_LIGHTEN 1
#endif
#ifndef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 0
#elif BLEND_MODE_DARKEN==1
#undef BLEND_MODE_DARKEN
#define BLEND_MODE_DARKEN 1
#endif
#ifndef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 0
#elif BLEND_MODE_DIVIDE==1
#undef BLEND_MODE_DIVIDE
#define BLEND_MODE_DIVIDE 1
#endif
#ifndef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 0
#elif BLEND_MODE_AVERAGE==1
#undef BLEND_MODE_AVERAGE
#define BLEND_MODE_AVERAGE 1
#endif
#ifndef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 0
#elif BLEND_MODE_SUBTRACT==1
#undef BLEND_MODE_SUBTRACT
#define BLEND_MODE_SUBTRACT 1
#endif
#ifndef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 0
#elif BLEND_MODE_DIFFERENCE==1
#undef BLEND_MODE_DIFFERENCE
#define BLEND_MODE_DIFFERENCE 1
#endif
#ifndef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 0
#elif BLEND_MODE_NEGATION==1
#undef BLEND_MODE_NEGATION
#define BLEND_MODE_NEGATION 1
#endif
#ifndef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 0
#elif BLEND_MODE_EXCLUSION==1
#undef BLEND_MODE_EXCLUSION
#define BLEND_MODE_EXCLUSION 1
#endif
#ifndef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 0
#elif BLEND_MODE_OVERLAY==1
#undef BLEND_MODE_OVERLAY
#define BLEND_MODE_OVERLAY 1
#endif
#ifndef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 0
#elif BLEND_MODE_SOFT_LIGHT==1
#undef BLEND_MODE_SOFT_LIGHT
#define BLEND_MODE_SOFT_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 0
#elif BLEND_MODE_HARD_LIGHT==1
#undef BLEND_MODE_HARD_LIGHT
#define BLEND_MODE_HARD_LIGHT 1
#endif
#ifndef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 0
#elif BLEND_MODE_COLOR_DODGE==1
#undef BLEND_MODE_COLOR_DODGE
#define BLEND_MODE_COLOR_DODGE 1
#endif
#ifndef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 0
#elif BLEND_MODE_COLOR_BURN==1
#undef BLEND_MODE_COLOR_BURN
#define BLEND_MODE_COLOR_BURN 1
#endif
#ifndef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 0
#elif BLEND_MODE_LINEAR_LIGHT==1
#undef BLEND_MODE_LINEAR_LIGHT
#define BLEND_MODE_LINEAR_LIGHT 1
#endif
#ifndef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 0
#elif BLEND_MODE_VIVID_LIGHT==1
#undef BLEND_MODE_VIVID_LIGHT
#define BLEND_MODE_VIVID_LIGHT 1
#endif
#ifndef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 0
#elif BLEND_MODE_PIN_LIGHT==1
#undef BLEND_MODE_PIN_LIGHT
#define BLEND_MODE_PIN_LIGHT 1
#endif
#ifndef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 0
#elif BLEND_MODE_HARD_MIX==1
#undef BLEND_MODE_HARD_MIX
#define BLEND_MODE_HARD_MIX 1
#endif
#ifndef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 0
#elif BLEND_MODE_HARD_REFLECT==1
#undef BLEND_MODE_HARD_REFLECT
#define BLEND_MODE_HARD_REFLECT 1
#endif
#ifndef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 0
#elif BLEND_MODE_HARD_GLOW==1
#undef BLEND_MODE_HARD_GLOW
#define BLEND_MODE_HARD_GLOW 1
#endif
#ifndef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 0
#elif BLEND_MODE_HARD_PHOENIX==1
#undef BLEND_MODE_HARD_PHOENIX
#define BLEND_MODE_HARD_PHOENIX 1
#endif
#ifndef BLEND_MODE_HUE
#define BLEND_MODE_HUE 0
#elif BLEND_MODE_HUE==1
#undef BLEND_MODE_HUE
#define BLEND_MODE_HUE 1
#endif
#ifndef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 0
#elif BLEND_MODE_SATURATION==1
#undef BLEND_MODE_SATURATION
#define BLEND_MODE_SATURATION 1
#endif
#ifndef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 0
#elif BLEND_MODE_COLOR==1
#undef BLEND_MODE_COLOR
#define BLEND_MODE_COLOR 1
#endif
#ifndef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 0
#elif BLEND_MODE_LUMINOSITY==1
#undef BLEND_MODE_LUMINOSITY
#define BLEND_MODE_LUMINOSITY 1
#endif
#ifndef sc_SkinBonesCount
#define sc_SkinBonesCount 0
#endif
#ifndef UseViewSpaceDepthVariant
#define UseViewSpaceDepthVariant 1
#elif UseViewSpaceDepthVariant==1
#undef UseViewSpaceDepthVariant
#define UseViewSpaceDepthVariant 1
#endif
#ifndef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 0
#elif sc_OITDepthGatherPass==1
#undef sc_OITDepthGatherPass
#define sc_OITDepthGatherPass 1
#endif
#ifndef sc_OITCompositingPass
#define sc_OITCompositingPass 0
#elif sc_OITCompositingPass==1
#undef sc_OITCompositingPass
#define sc_OITCompositingPass 1
#endif
#ifndef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 0
#elif sc_OITDepthBoundsPass==1
#undef sc_OITDepthBoundsPass
#define sc_OITDepthBoundsPass 1
#endif
#ifndef sc_OITMaxLayers4Plus1
#define sc_OITMaxLayers4Plus1 0
#elif sc_OITMaxLayers4Plus1==1
#undef sc_OITMaxLayers4Plus1
#define sc_OITMaxLayers4Plus1 1
#endif
#ifndef sc_OITMaxLayersVisualizeLayerCount
#define sc_OITMaxLayersVisualizeLayerCount 0
#elif sc_OITMaxLayersVisualizeLayerCount==1
#undef sc_OITMaxLayersVisualizeLayerCount
#define sc_OITMaxLayersVisualizeLayerCount 1
#endif
#ifndef sc_OITMaxLayers8
#define sc_OITMaxLayers8 0
#elif sc_OITMaxLayers8==1
#undef sc_OITMaxLayers8
#define sc_OITMaxLayers8 1
#endif
#ifndef sc_OITFrontLayerPass
#define sc_OITFrontLayerPass 0
#elif sc_OITFrontLayerPass==1
#undef sc_OITFrontLayerPass
#define sc_OITFrontLayerPass 1
#endif
#ifndef sc_OITDepthPrepass
#define sc_OITDepthPrepass 0
#elif sc_OITDepthPrepass==1
#undef sc_OITDepthPrepass
#define sc_OITDepthPrepass 1
#endif
#ifndef ENABLE_STIPPLE_PATTERN_TEST
#define ENABLE_STIPPLE_PATTERN_TEST 0
#elif ENABLE_STIPPLE_PATTERN_TEST==1
#undef ENABLE_STIPPLE_PATTERN_TEST
#define ENABLE_STIPPLE_PATTERN_TEST 1
#endif
#ifndef sc_ProjectiveShadowsCaster
#define sc_ProjectiveShadowsCaster 0
#elif sc_ProjectiveShadowsCaster==1
#undef sc_ProjectiveShadowsCaster
#define sc_ProjectiveShadowsCaster 1
#endif
#ifndef sc_RenderAlphaToColor
#define sc_RenderAlphaToColor 0
#elif sc_RenderAlphaToColor==1
#undef sc_RenderAlphaToColor
#define sc_RenderAlphaToColor 1
#endif
#ifndef sc_BlendMode_Custom
#define sc_BlendMode_Custom 0
#elif sc_BlendMode_Custom==1
#undef sc_BlendMode_Custom
#define sc_BlendMode_Custom 1
#endif
#ifndef sc_Voxelization
#define sc_Voxelization 0
#elif sc_Voxelization==1
#undef sc_Voxelization
#define sc_Voxelization 1
#endif
#ifndef sc_OutputBounds
#define sc_OutputBounds 0
#elif sc_OutputBounds==1
#undef sc_OutputBounds
#define sc_OutputBounds 1
#endif
#ifndef baseTexHasSwappedViews
#define baseTexHasSwappedViews 0
#elif baseTexHasSwappedViews==1
#undef baseTexHasSwappedViews
#define baseTexHasSwappedViews 1
#endif
#ifndef baseTexLayout
#define baseTexLayout 0
#endif
#ifndef opacityTexHasSwappedViews
#define opacityTexHasSwappedViews 0
#elif opacityTexHasSwappedViews==1
#undef opacityTexHasSwappedViews
#define opacityTexHasSwappedViews 1
#endif
#ifndef opacityTexLayout
#define opacityTexLayout 0
#endif
#ifndef normalTexHasSwappedViews
#define normalTexHasSwappedViews 0
#elif normalTexHasSwappedViews==1
#undef normalTexHasSwappedViews
#define normalTexHasSwappedViews 1
#endif
#ifndef normalTexLayout
#define normalTexLayout 0
#endif
#ifndef detailNormalTexHasSwappedViews
#define detailNormalTexHasSwappedViews 0
#elif detailNormalTexHasSwappedViews==1
#undef detailNormalTexHasSwappedViews
#define detailNormalTexHasSwappedViews 1
#endif
#ifndef detailNormalTexLayout
#define detailNormalTexLayout 0
#endif
#ifndef emissiveTexHasSwappedViews
#define emissiveTexHasSwappedViews 0
#elif emissiveTexHasSwappedViews==1
#undef emissiveTexHasSwappedViews
#define emissiveTexHasSwappedViews 1
#endif
#ifndef emissiveTexLayout
#define emissiveTexLayout 0
#endif
#ifndef reflectionTexHasSwappedViews
#define reflectionTexHasSwappedViews 0
#elif reflectionTexHasSwappedViews==1
#undef reflectionTexHasSwappedViews
#define reflectionTexHasSwappedViews 1
#endif
#ifndef reflectionTexLayout
#define reflectionTexLayout 0
#endif
#ifndef reflectionModulationTexHasSwappedViews
#define reflectionModulationTexHasSwappedViews 0
#elif reflectionModulationTexHasSwappedViews==1
#undef reflectionModulationTexHasSwappedViews
#define reflectionModulationTexHasSwappedViews 1
#endif
#ifndef reflectionModulationTexLayout
#define reflectionModulationTexLayout 0
#endif
#ifndef rimColorTexHasSwappedViews
#define rimColorTexHasSwappedViews 0
#elif rimColorTexHasSwappedViews==1
#undef rimColorTexHasSwappedViews
#define rimColorTexHasSwappedViews 1
#endif
#ifndef rimColorTexLayout
#define rimColorTexLayout 0
#endif
#ifndef materialParamsTexHasSwappedViews
#define materialParamsTexHasSwappedViews 0
#elif materialParamsTexHasSwappedViews==1
#undef materialParamsTexHasSwappedViews
#define materialParamsTexHasSwappedViews 1
#endif
#ifndef materialParamsTexLayout
#define materialParamsTexLayout 0
#endif
#ifndef sc_EnvLightMode
#define sc_EnvLightMode 0
#endif
#ifndef sc_AmbientLightMode_EnvironmentMap
#define sc_AmbientLightMode_EnvironmentMap 0
#endif
#ifndef sc_AmbientLightMode_FromCamera
#define sc_AmbientLightMode_FromCamera 0
#endif
#ifndef sc_LightEstimation
#define sc_LightEstimation 0
#elif sc_LightEstimation==1
#undef sc_LightEstimation
#define sc_LightEstimation 1
#endif
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
vec3 ambientLight;
};
#ifndef sc_LightEstimationSGCount
#define sc_LightEstimationSGCount 0
#endif
#ifndef sc_HasDiffuseEnvmap
#define sc_HasDiffuseEnvmap 0
#elif sc_HasDiffuseEnvmap==1
#undef sc_HasDiffuseEnvmap
#define sc_HasDiffuseEnvmap 1
#endif
#ifndef sc_AmbientLightMode_SphericalHarmonics
#define sc_AmbientLightMode_SphericalHarmonics 0
#endif
#ifndef sc_AmbientLightsCount
#define sc_AmbientLightsCount 0
#endif
#ifndef sc_AmbientLightMode0
#define sc_AmbientLightMode0 0
#endif
#ifndef sc_AmbientLightMode_Constant
#define sc_AmbientLightMode_Constant 0
#endif
struct sc_AmbientLight_t
{
vec3 color;
float intensity;
};
#ifndef sc_AmbientLightMode1
#define sc_AmbientLightMode1 0
#endif
#ifndef sc_AmbientLightMode2
#define sc_AmbientLightMode2 0
#endif
#ifndef sc_DirectionalLightsCount
#define sc_DirectionalLightsCount 0
#endif
struct sc_DirectionalLight_t
{
vec3 direction;
vec4 color;
};
#ifndef sc_PointLightsCount
#define sc_PointLightsCount 0
#endif
struct sc_PointLight_t
{
bool falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
vec3 direction;
vec3 position;
vec4 color;
};
#ifndef sc_IsEditor
#define sc_IsEditor 0
#elif sc_IsEditor==1
#undef sc_IsEditor
#define sc_IsEditor 1
#endif
#ifndef Tweak_N37
#define Tweak_N37 0
#elif Tweak_N37==1
#undef Tweak_N37
#define Tweak_N37 1
#endif
#ifndef Tweak_N121
#define Tweak_N121 0
#elif Tweak_N121==1
#undef Tweak_N121
#define Tweak_N121 1
#endif
#ifndef Tweak_N67
#define Tweak_N67 0
#elif Tweak_N67==1
#undef Tweak_N67
#define Tweak_N67 1
#endif
#ifndef uv2EnableAnimation
#define uv2EnableAnimation 0
#elif uv2EnableAnimation==1
#undef uv2EnableAnimation
#define uv2EnableAnimation 1
#endif
#ifndef NODE_13_DROPLIST_ITEM
#define NODE_13_DROPLIST_ITEM 0
#endif
#ifndef Tweak_N11
#define Tweak_N11 0
#elif Tweak_N11==1
#undef Tweak_N11
#define Tweak_N11 1
#endif
#ifndef uv3EnableAnimation
#define uv3EnableAnimation 0
#elif uv3EnableAnimation==1
#undef uv3EnableAnimation
#define uv3EnableAnimation 1
#endif
#ifndef NODE_49_DROPLIST_ITEM
#define NODE_49_DROPLIST_ITEM 0
#endif
#ifndef NODE_27_DROPLIST_ITEM
#define NODE_27_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_baseTex
#define SC_USE_UV_TRANSFORM_baseTex 0
#elif SC_USE_UV_TRANSFORM_baseTex==1
#undef SC_USE_UV_TRANSFORM_baseTex
#define SC_USE_UV_TRANSFORM_baseTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_baseTex
#define SC_SOFTWARE_WRAP_MODE_U_baseTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_baseTex
#define SC_SOFTWARE_WRAP_MODE_V_baseTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_baseTex
#define SC_USE_UV_MIN_MAX_baseTex 0
#elif SC_USE_UV_MIN_MAX_baseTex==1
#undef SC_USE_UV_MIN_MAX_baseTex
#define SC_USE_UV_MIN_MAX_baseTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_baseTex
#define SC_USE_CLAMP_TO_BORDER_baseTex 0
#elif SC_USE_CLAMP_TO_BORDER_baseTex==1
#undef SC_USE_CLAMP_TO_BORDER_baseTex
#define SC_USE_CLAMP_TO_BORDER_baseTex 1
#endif
#ifndef NODE_38_DROPLIST_ITEM
#define NODE_38_DROPLIST_ITEM 0
#endif
#ifndef Tweak_N308
#define Tweak_N308 0
#elif Tweak_N308==1
#undef Tweak_N308
#define Tweak_N308 1
#endif
#ifndef NODE_69_DROPLIST_ITEM
#define NODE_69_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_opacityTex
#define SC_USE_UV_TRANSFORM_opacityTex 0
#elif SC_USE_UV_TRANSFORM_opacityTex==1
#undef SC_USE_UV_TRANSFORM_opacityTex
#define SC_USE_UV_TRANSFORM_opacityTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_opacityTex
#define SC_SOFTWARE_WRAP_MODE_U_opacityTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_opacityTex
#define SC_SOFTWARE_WRAP_MODE_V_opacityTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_opacityTex
#define SC_USE_UV_MIN_MAX_opacityTex 0
#elif SC_USE_UV_MIN_MAX_opacityTex==1
#undef SC_USE_UV_MIN_MAX_opacityTex
#define SC_USE_UV_MIN_MAX_opacityTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_opacityTex
#define SC_USE_CLAMP_TO_BORDER_opacityTex 0
#elif SC_USE_CLAMP_TO_BORDER_opacityTex==1
#undef SC_USE_CLAMP_TO_BORDER_opacityTex
#define SC_USE_CLAMP_TO_BORDER_opacityTex 1
#endif
#ifndef Tweak_N354
#define Tweak_N354 0
#elif Tweak_N354==1
#undef Tweak_N354
#define Tweak_N354 1
#endif
#ifndef NODE_181_DROPLIST_ITEM
#define NODE_181_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_normalTex
#define SC_USE_UV_TRANSFORM_normalTex 0
#elif SC_USE_UV_TRANSFORM_normalTex==1
#undef SC_USE_UV_TRANSFORM_normalTex
#define SC_USE_UV_TRANSFORM_normalTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_normalTex
#define SC_SOFTWARE_WRAP_MODE_U_normalTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_normalTex
#define SC_SOFTWARE_WRAP_MODE_V_normalTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_normalTex
#define SC_USE_UV_MIN_MAX_normalTex 0
#elif SC_USE_UV_MIN_MAX_normalTex==1
#undef SC_USE_UV_MIN_MAX_normalTex
#define SC_USE_UV_MIN_MAX_normalTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_normalTex
#define SC_USE_CLAMP_TO_BORDER_normalTex 0
#elif SC_USE_CLAMP_TO_BORDER_normalTex==1
#undef SC_USE_CLAMP_TO_BORDER_normalTex
#define SC_USE_CLAMP_TO_BORDER_normalTex 1
#endif
#ifndef Tweak_N218
#define Tweak_N218 0
#elif Tweak_N218==1
#undef Tweak_N218
#define Tweak_N218 1
#endif
#ifndef NODE_184_DROPLIST_ITEM
#define NODE_184_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_detailNormalTex
#define SC_USE_UV_TRANSFORM_detailNormalTex 0
#elif SC_USE_UV_TRANSFORM_detailNormalTex==1
#undef SC_USE_UV_TRANSFORM_detailNormalTex
#define SC_USE_UV_TRANSFORM_detailNormalTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_detailNormalTex
#define SC_SOFTWARE_WRAP_MODE_U_detailNormalTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_detailNormalTex
#define SC_SOFTWARE_WRAP_MODE_V_detailNormalTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_detailNormalTex
#define SC_USE_UV_MIN_MAX_detailNormalTex 0
#elif SC_USE_UV_MIN_MAX_detailNormalTex==1
#undef SC_USE_UV_MIN_MAX_detailNormalTex
#define SC_USE_UV_MIN_MAX_detailNormalTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_detailNormalTex
#define SC_USE_CLAMP_TO_BORDER_detailNormalTex 0
#elif SC_USE_CLAMP_TO_BORDER_detailNormalTex==1
#undef SC_USE_CLAMP_TO_BORDER_detailNormalTex
#define SC_USE_CLAMP_TO_BORDER_detailNormalTex 1
#endif
#ifndef Tweak_N223
#define Tweak_N223 0
#elif Tweak_N223==1
#undef Tweak_N223
#define Tweak_N223 1
#endif
#ifndef NODE_76_DROPLIST_ITEM
#define NODE_76_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_emissiveTex
#define SC_USE_UV_TRANSFORM_emissiveTex 0
#elif SC_USE_UV_TRANSFORM_emissiveTex==1
#undef SC_USE_UV_TRANSFORM_emissiveTex
#define SC_USE_UV_TRANSFORM_emissiveTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_emissiveTex
#define SC_SOFTWARE_WRAP_MODE_U_emissiveTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_emissiveTex
#define SC_SOFTWARE_WRAP_MODE_V_emissiveTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_emissiveTex
#define SC_USE_UV_MIN_MAX_emissiveTex 0
#elif SC_USE_UV_MIN_MAX_emissiveTex==1
#undef SC_USE_UV_MIN_MAX_emissiveTex
#define SC_USE_UV_MIN_MAX_emissiveTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_emissiveTex
#define SC_USE_CLAMP_TO_BORDER_emissiveTex 0
#elif SC_USE_CLAMP_TO_BORDER_emissiveTex==1
#undef SC_USE_CLAMP_TO_BORDER_emissiveTex
#define SC_USE_CLAMP_TO_BORDER_emissiveTex 1
#endif
#ifndef Tweak_N179
#define Tweak_N179 0
#elif Tweak_N179==1
#undef Tweak_N179
#define Tweak_N179 1
#endif
#ifndef Tweak_N177
#define Tweak_N177 0
#elif Tweak_N177==1
#undef Tweak_N177
#define Tweak_N177 1
#endif
#ifndef NODE_228_DROPLIST_ITEM
#define NODE_228_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_reflectionModulationTex
#define SC_USE_UV_TRANSFORM_reflectionModulationTex 0
#elif SC_USE_UV_TRANSFORM_reflectionModulationTex==1
#undef SC_USE_UV_TRANSFORM_reflectionModulationTex
#define SC_USE_UV_TRANSFORM_reflectionModulationTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex
#define SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex
#define SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_reflectionModulationTex
#define SC_USE_UV_MIN_MAX_reflectionModulationTex 0
#elif SC_USE_UV_MIN_MAX_reflectionModulationTex==1
#undef SC_USE_UV_MIN_MAX_reflectionModulationTex
#define SC_USE_UV_MIN_MAX_reflectionModulationTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_reflectionModulationTex
#define SC_USE_CLAMP_TO_BORDER_reflectionModulationTex 0
#elif SC_USE_CLAMP_TO_BORDER_reflectionModulationTex==1
#undef SC_USE_CLAMP_TO_BORDER_reflectionModulationTex
#define SC_USE_CLAMP_TO_BORDER_reflectionModulationTex 1
#endif
#ifndef SC_USE_UV_TRANSFORM_reflectionTex
#define SC_USE_UV_TRANSFORM_reflectionTex 0
#elif SC_USE_UV_TRANSFORM_reflectionTex==1
#undef SC_USE_UV_TRANSFORM_reflectionTex
#define SC_USE_UV_TRANSFORM_reflectionTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_reflectionTex
#define SC_SOFTWARE_WRAP_MODE_U_reflectionTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_reflectionTex
#define SC_SOFTWARE_WRAP_MODE_V_reflectionTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_reflectionTex
#define SC_USE_UV_MIN_MAX_reflectionTex 0
#elif SC_USE_UV_MIN_MAX_reflectionTex==1
#undef SC_USE_UV_MIN_MAX_reflectionTex
#define SC_USE_UV_MIN_MAX_reflectionTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_reflectionTex
#define SC_USE_CLAMP_TO_BORDER_reflectionTex 0
#elif SC_USE_CLAMP_TO_BORDER_reflectionTex==1
#undef SC_USE_CLAMP_TO_BORDER_reflectionTex
#define SC_USE_CLAMP_TO_BORDER_reflectionTex 1
#endif
#ifndef Tweak_N74
#define Tweak_N74 0
#elif Tweak_N74==1
#undef Tweak_N74
#define Tweak_N74 1
#endif
#ifndef Tweak_N216
#define Tweak_N216 0
#elif Tweak_N216==1
#undef Tweak_N216
#define Tweak_N216 1
#endif
#ifndef NODE_315_DROPLIST_ITEM
#define NODE_315_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_rimColorTex
#define SC_USE_UV_TRANSFORM_rimColorTex 0
#elif SC_USE_UV_TRANSFORM_rimColorTex==1
#undef SC_USE_UV_TRANSFORM_rimColorTex
#define SC_USE_UV_TRANSFORM_rimColorTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_rimColorTex
#define SC_SOFTWARE_WRAP_MODE_U_rimColorTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_rimColorTex
#define SC_SOFTWARE_WRAP_MODE_V_rimColorTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_rimColorTex
#define SC_USE_UV_MIN_MAX_rimColorTex 0
#elif SC_USE_UV_MIN_MAX_rimColorTex==1
#undef SC_USE_UV_MIN_MAX_rimColorTex
#define SC_USE_UV_MIN_MAX_rimColorTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_rimColorTex
#define SC_USE_CLAMP_TO_BORDER_rimColorTex 0
#elif SC_USE_CLAMP_TO_BORDER_rimColorTex==1
#undef SC_USE_CLAMP_TO_BORDER_rimColorTex
#define SC_USE_CLAMP_TO_BORDER_rimColorTex 1
#endif
#ifndef rimInvert
#define rimInvert 0
#elif rimInvert==1
#undef rimInvert
#define rimInvert 1
#endif
#ifndef NODE_221_DROPLIST_ITEM
#define NODE_221_DROPLIST_ITEM 0
#endif
#ifndef SC_USE_UV_TRANSFORM_materialParamsTex
#define SC_USE_UV_TRANSFORM_materialParamsTex 0
#elif SC_USE_UV_TRANSFORM_materialParamsTex==1
#undef SC_USE_UV_TRANSFORM_materialParamsTex
#define SC_USE_UV_TRANSFORM_materialParamsTex 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_materialParamsTex
#define SC_SOFTWARE_WRAP_MODE_U_materialParamsTex -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_materialParamsTex
#define SC_SOFTWARE_WRAP_MODE_V_materialParamsTex -1
#endif
#ifndef SC_USE_UV_MIN_MAX_materialParamsTex
#define SC_USE_UV_MIN_MAX_materialParamsTex 0
#elif SC_USE_UV_MIN_MAX_materialParamsTex==1
#undef SC_USE_UV_MIN_MAX_materialParamsTex
#define SC_USE_UV_MIN_MAX_materialParamsTex 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_materialParamsTex
#define SC_USE_CLAMP_TO_BORDER_materialParamsTex 0
#elif SC_USE_CLAMP_TO_BORDER_materialParamsTex==1
#undef SC_USE_CLAMP_TO_BORDER_materialParamsTex
#define SC_USE_CLAMP_TO_BORDER_materialParamsTex 1
#endif
#ifndef Tweak_N219
#define Tweak_N219 0
#elif Tweak_N219==1
#undef Tweak_N219
#define Tweak_N219 1
#endif
#ifndef sc_DepthOnly
#define sc_DepthOnly 0
#elif sc_DepthOnly==1
#undef sc_DepthOnly
#define sc_DepthOnly 1
#endif
struct sc_Camera_t
{
vec3 position;
float aspect;
vec2 clipPlanes;
};
uniform vec4 sc_CurrentRenderTargetDims;
uniform mat4 sc_ProjectionMatrixArray[sc_NumStereoViews];
uniform float sc_ShadowDensity;
uniform vec4 sc_ShadowColor;
uniform mat4 sc_ViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_PrevFrameViewProjectionMatrixArray[sc_NumStereoViews];
uniform mat4 sc_PrevFrameModelMatrix;
uniform mat4 sc_ModelMatrixInverse;
uniform vec4 sc_UniformConstants;
uniform float correctedIntensity;
uniform mat3 intensityTextureTransform;
uniform vec4 intensityTextureUvMinMax;
uniform vec4 intensityTextureBorderColor;
uniform float alphaTestThreshold;
uniform sc_LightEstimationData_t sc_LightEstimationData;
uniform vec3 sc_EnvmapRotation;
uniform vec4 sc_EnvmapSpecularSize;
uniform vec4 sc_EnvmapDiffuseSize;
uniform float sc_EnvmapExposure;
uniform vec3 sc_Sh[9];
uniform float sc_ShIntensity;
uniform sc_AmbientLight_t sc_AmbientLights[(sc_AmbientLightsCount+1)];
uniform sc_DirectionalLight_t sc_DirectionalLights[(sc_DirectionalLightsCount+1)];
uniform sc_PointLight_t sc_PointLights[(sc_PointLightsCount+1)];
uniform vec3 recolorRed;
uniform vec4 baseColor;
uniform vec2 uv2Scale;
uniform vec2 uv2Offset;
uniform float Port_Speed_N022;
uniform vec2 uv3Scale;
uniform vec2 uv3Offset;
uniform float Port_Speed_N063;
uniform mat3 baseTexTransform;
uniform vec4 baseTexUvMinMax;
uniform vec4 baseTexBorderColor;
uniform vec3 recolorGreen;
uniform vec3 recolorBlue;
uniform vec4 Port_Default_N369;
uniform mat3 opacityTexTransform;
uniform vec4 opacityTexUvMinMax;
uniform vec4 opacityTexBorderColor;
uniform mat3 normalTexTransform;
uniform vec4 normalTexUvMinMax;
uniform vec4 normalTexBorderColor;
uniform mat3 detailNormalTexTransform;
uniform vec4 detailNormalTexUvMinMax;
uniform vec4 detailNormalTexBorderColor;
uniform vec3 Port_Default_N113;
uniform float Port_Strength1_N200;
uniform float Port_Strength2_N200;
uniform mat3 emissiveTexTransform;
uniform vec4 emissiveTexUvMinMax;
uniform vec4 emissiveTexBorderColor;
uniform vec3 Port_Default_N132;
uniform vec3 emissiveColor;
uniform float emissiveIntensity;
uniform float reflectionIntensity;
uniform mat3 reflectionModulationTexTransform;
uniform vec4 reflectionModulationTexUvMinMax;
uniform vec4 reflectionModulationTexBorderColor;
uniform vec3 Port_Input1_N257;
uniform float Port_Input1_N264;
uniform float Port_Input1_N268;
uniform float Port_Input1_N270;
uniform mat3 reflectionTexTransform;
uniform vec4 reflectionTexUvMinMax;
uniform vec4 reflectionTexBorderColor;
uniform vec3 Port_Default_N041;
uniform vec3 rimColor;
uniform float rimIntensity;
uniform mat3 rimColorTexTransform;
uniform vec4 rimColorTexUvMinMax;
uniform vec4 rimColorTexBorderColor;
uniform float rimExponent;
uniform vec3 Port_Default_N170;
uniform float metallic;
uniform float roughness;
uniform mat3 materialParamsTexTransform;
uniform vec4 materialParamsTexUvMinMax;
uniform vec4 materialParamsTexBorderColor;
uniform float specularAoDarkening;
uniform float specularAoIntensity;
uniform vec3 Port_Import_N235;
uniform vec3 Port_Input0_N239;
uniform vec3 Port_Input1_N322;
uniform vec3 Port_Input0_N325;
uniform vec3 Port_Default_N326;
uniform vec4 sc_Time;
uniform sc_Camera_t sc_Camera;
uniform float Port_Default_N204;
uniform float Port_Input2_N072;
uniform vec3 Port_Default_N103;
uniform vec3 Port_Default_N134;
uniform vec3 Port_Default_N173;
uniform vec3 Port_Value1_N079;
uniform int PreviewEnabled;
uniform sampler2D baseTex;
uniform sampler2D opacityTex;
uniform sampler2D normalTex;
uniform sampler2D detailNormalTex;
uniform sampler2D emissiveTex;
uniform sampler2D reflectionTex;
uniform sampler2D reflectionModulationTex;
uniform sampler2D rimColorTex;
uniform sampler2D materialParamsTex;
uniform sampler2D sc_SSAOTexture;
uniform sampler2D sc_ShadowTexture;
uniform sampler2D sc_EnvmapSpecular;
uniform sampler2D sc_EnvmapDiffuse;
uniform sampler2D sc_ScreenTexture;
uniform sampler2D intensityTexture;
uniform sampler2D sc_OITFrontDepthTexture;
uniform sampler2D sc_OITDepthHigh0;
uniform sampler2D sc_OITDepthLow0;
uniform sampler2D sc_OITAlpha0;
uniform sampler2D sc_OITDepthHigh1;
uniform sampler2D sc_OITDepthLow1;
uniform sampler2D sc_OITAlpha1;
uniform sampler2D sc_OITFilteredDepthBoundsTexture;
varying float varStereoViewID;
varying vec2 varShadowTex;
varying float varClipDistance;
varying vec4 varScreenPos;
varying float varViewSpaceDepth;
varying vec4 PreviewVertexColor;
varying float PreviewVertexSaved;
varying vec3 varPos;
varying vec4 varColor;
varying vec4 varPackedTex;
varying vec4 varTangent;
varying vec3 varNormal;
varying vec2 varScreenTexturePos;
int sc_GetStereoViewIndex()
{
int l9_0;
#if (sc_StereoRenderingMode==0)
{
l9_0=0;
}
#else
{
l9_0=int(varStereoViewID);
}
#endif
return l9_0;
}
vec2 sc_SamplingCoordsGlobalToView(vec3 uvi,int renderingLayout,int viewIndex)
{
if (renderingLayout==1)
{
uvi.y=((2.0*uvi.y)+float(viewIndex))-1.0;
}
return uvi.xy;
}
vec2 sc_ScreenCoordsGlobalToView(vec2 uv)
{
vec2 l9_0;
#if (sc_StereoRenderingMode==1)
{
l9_0=sc_SamplingCoordsGlobalToView(vec3(uv,0.0),1,sc_GetStereoViewIndex());
}
#else
{
l9_0=uv;
}
#endif
return l9_0;
}
void Node17_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_13_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_13_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_13_DROPLIST_ITEM==2)
{
Value2=Globals.gScreenCoord;
Result=Value2;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
void Node122_If_else(float Bool1,vec2 Value1,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (uv2EnableAnimation)
{
vec2 param_5;
Node17_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_5,Globals);
Value1=((param_5*uv2Scale)+uv2Offset)+(uv2Offset*(Globals.gTimeElapsed*Port_Speed_N022));
Result=Value1;
}
#else
{
vec2 param_12;
Node17_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_12,Globals);
Default=(param_12*uv2Scale)+uv2Offset;
Result=Default;
}
#endif
}
void Node1_If_else(float Bool1,vec2 Value1,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (Tweak_N67)
{
vec2 param_3;
Node122_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value1=param_3;
Result=Value1;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
void Node59_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_49_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_49_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_49_DROPLIST_ITEM==2)
{
Value2=Globals.gScreenCoord;
Result=Value2;
}
#else
{
#if (NODE_49_DROPLIST_ITEM==3)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value3=param_3;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
void Node64_If_else(float Bool1,vec2 Value1,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (uv3EnableAnimation)
{
vec2 param_6;
Node59_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
Value1=((param_6*uv3Scale)+uv3Offset)+(uv3Offset*(Globals.gTimeElapsed*Port_Speed_N063));
Result=Value1;
}
#else
{
vec2 param_14;
Node59_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_14,Globals);
Default=(param_14*uv3Scale)+uv3Offset;
Result=Default;
}
#endif
}
void Node35_If_else(float Bool1,vec2 Value1,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (Tweak_N11)
{
vec2 param_3;
Node64_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value1=param_3;
Result=Value1;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
void Node388_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_27_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_27_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_27_DROPLIST_ITEM==2)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value2=param_3;
Result=Value2;
}
#else
{
#if (NODE_27_DROPLIST_ITEM==3)
{
vec2 param_8;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),param_8,Globals);
Value3=param_8;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
int baseTexGetStereoViewIndex()
{
int l9_0;
#if (baseTexHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
void sc_SoftwareWrapEarly(inout float uv,int softwareWrapMode)
{
if (softwareWrapMode==1)
{
uv=fract(uv);
}
else
{
if (softwareWrapMode==2)
{
float l9_0=fract(uv);
uv=mix(l9_0,1.0-l9_0,clamp(step(0.25,fract((uv-l9_0)*0.5)),0.0,1.0));
}
}
}
void sc_ClampUV(inout float value,float minValue,float maxValue,bool useClampToBorder,inout float clampToBorderFactor)
{
float l9_0=clamp(value,minValue,maxValue);
float l9_1=step(abs(value-l9_0),9.9999997e-06);
clampToBorderFactor*=(l9_1+((1.0-float(useClampToBorder))*(1.0-l9_1)));
value=l9_0;
}
vec2 sc_TransformUV(vec2 uv,bool useUvTransform,mat3 uvTransform)
{
if (useUvTransform)
{
uv=vec2((uvTransform*vec3(uv,1.0)).xy);
}
return uv;
}
void sc_SoftwareWrapLate(inout float uv,int softwareWrapMode,bool useClampToBorder,inout float clampToBorderFactor)
{
if ((softwareWrapMode==0)||(softwareWrapMode==3))
{
sc_ClampUV(uv,0.0,1.0,useClampToBorder,clampToBorderFactor);
}
}
vec3 sc_SamplingCoordsViewToGlobal(vec2 uv,int renderingLayout,int viewIndex)
{
vec3 l9_0;
if (renderingLayout==0)
{
l9_0=vec3(uv,0.0);
}
else
{
vec3 l9_1;
if (renderingLayout==1)
{
l9_1=vec3(uv.x,(uv.y*0.5)+(0.5-(float(viewIndex)*0.5)),0.0);
}
else
{
l9_1=vec3(uv,float(viewIndex));
}
l9_0=l9_1;
}
return l9_0;
}
void Node369_If_else(float Bool1,vec4 Value1,vec4 Default,out vec4 Result,ssGlobals Globals)
{
#if (Tweak_N121)
{
vec2 param_6;
Node388_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
bool l9_0=(int(SC_USE_CLAMP_TO_BORDER_baseTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_baseTex)!=0));
float l9_1=param_6.x;
sc_SoftwareWrapEarly(l9_1,ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).x);
float l9_2=l9_1;
float l9_3=param_6.y;
sc_SoftwareWrapEarly(l9_3,ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).y);
float l9_4=l9_3;
vec2 l9_5;
float l9_6;
#if (SC_USE_UV_MIN_MAX_baseTex)
{
bool l9_7;
#if (SC_USE_CLAMP_TO_BORDER_baseTex)
{
l9_7=ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).x==3;
}
#else
{
l9_7=(int(SC_USE_CLAMP_TO_BORDER_baseTex)!=0);
}
#endif
float l9_8=l9_2;
float l9_9=1.0;
sc_ClampUV(l9_8,baseTexUvMinMax.x,baseTexUvMinMax.z,l9_7,l9_9);
float l9_10=l9_8;
float l9_11=l9_9;
bool l9_12;
#if (SC_USE_CLAMP_TO_BORDER_baseTex)
{
l9_12=ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).y==3;
}
#else
{
l9_12=(int(SC_USE_CLAMP_TO_BORDER_baseTex)!=0);
}
#endif
float l9_13=l9_4;
float l9_14=l9_11;
sc_ClampUV(l9_13,baseTexUvMinMax.y,baseTexUvMinMax.w,l9_12,l9_14);
l9_6=l9_14;
l9_5=vec2(l9_10,l9_13);
}
#else
{
l9_6=1.0;
l9_5=vec2(l9_2,l9_4);
}
#endif
vec2 l9_15=sc_TransformUV(l9_5,(int(SC_USE_UV_TRANSFORM_baseTex)!=0),baseTexTransform);
float l9_16=l9_15.x;
float l9_17=l9_6;
sc_SoftwareWrapLate(l9_16,ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).x,l9_0,l9_17);
float l9_18=l9_15.y;
float l9_19=l9_17;
sc_SoftwareWrapLate(l9_18,ivec2(SC_SOFTWARE_WRAP_MODE_U_baseTex,SC_SOFTWARE_WRAP_MODE_V_baseTex).y,l9_0,l9_19);
float l9_20=l9_19;
vec3 l9_21=sc_SamplingCoordsViewToGlobal(vec2(l9_16,l9_18),baseTexLayout,baseTexGetStereoViewIndex());
vec4 l9_22=texture2D(baseTex,l9_21.xy,0.0);
vec4 l9_23;
#if (SC_USE_CLAMP_TO_BORDER_baseTex)
{
l9_23=mix(baseTexBorderColor,l9_22,vec4(l9_20));
}
#else
{
l9_23=l9_22;
}
#endif
Value1=l9_23;
Result=Value1;
}
#else
{
Result=Default;
}
#endif
}
void Node80_If_else(float Bool1,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
#if (Tweak_N37)
{
vec4 param_3;
Node369_If_else(0.0,vec4(0.0),Port_Default_N369,param_3,Globals);
vec4 l9_0=baseColor*param_3;
Value1=((recolorRed*vec3(l9_0.x))+(recolorGreen*vec3(l9_0.y)))+(recolorBlue*vec3(l9_0.z));
Result=Value1;
}
#else
{
vec4 param_8;
Node369_If_else(0.0,vec4(0.0),Port_Default_N369,param_8,Globals);
Default=(baseColor*param_8).xyz;
Result=Default;
}
#endif
}
void Node346_Normalize(vec3 Input0,out vec3 Output,ssGlobals Globals)
{
vec3 l9_0=Input0;
vec3 l9_1=Input0;
float l9_2=dot(l9_0,l9_1);
float l9_3;
if (l9_2>0.0)
{
l9_3=1.0/sqrt(l9_2);
}
else
{
l9_3=0.0;
}
Output=Input0*l9_3;
}
void Node208_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_181_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_181_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_181_DROPLIST_ITEM==2)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value2=param_3;
Result=Value2;
}
#else
{
#if (NODE_181_DROPLIST_ITEM==3)
{
vec2 param_8;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),param_8,Globals);
Value3=param_8;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
int normalTexGetStereoViewIndex()
{
int l9_0;
#if (normalTexHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
void Node209_Texture_2D_Sample(vec2 UVCoord,out vec4 Color,ssGlobals Globals)
{
bool l9_0=(int(SC_USE_CLAMP_TO_BORDER_normalTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_normalTex)!=0));
float l9_1=UVCoord.x;
sc_SoftwareWrapEarly(l9_1,ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).x);
float l9_2=l9_1;
float l9_3=UVCoord.y;
sc_SoftwareWrapEarly(l9_3,ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).y);
float l9_4=l9_3;
vec2 l9_5;
float l9_6;
#if (SC_USE_UV_MIN_MAX_normalTex)
{
bool l9_7;
#if (SC_USE_CLAMP_TO_BORDER_normalTex)
{
l9_7=ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).x==3;
}
#else
{
l9_7=(int(SC_USE_CLAMP_TO_BORDER_normalTex)!=0);
}
#endif
float l9_8=l9_2;
float l9_9=1.0;
sc_ClampUV(l9_8,normalTexUvMinMax.x,normalTexUvMinMax.z,l9_7,l9_9);
float l9_10=l9_8;
float l9_11=l9_9;
bool l9_12;
#if (SC_USE_CLAMP_TO_BORDER_normalTex)
{
l9_12=ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).y==3;
}
#else
{
l9_12=(int(SC_USE_CLAMP_TO_BORDER_normalTex)!=0);
}
#endif
float l9_13=l9_4;
float l9_14=l9_11;
sc_ClampUV(l9_13,normalTexUvMinMax.y,normalTexUvMinMax.w,l9_12,l9_14);
l9_6=l9_14;
l9_5=vec2(l9_10,l9_13);
}
#else
{
l9_6=1.0;
l9_5=vec2(l9_2,l9_4);
}
#endif
vec2 l9_15=sc_TransformUV(l9_5,(int(SC_USE_UV_TRANSFORM_normalTex)!=0),normalTexTransform);
float l9_16=l9_15.x;
float l9_17=l9_6;
sc_SoftwareWrapLate(l9_16,ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).x,l9_0,l9_17);
float l9_18=l9_15.y;
float l9_19=l9_17;
sc_SoftwareWrapLate(l9_18,ivec2(SC_SOFTWARE_WRAP_MODE_U_normalTex,SC_SOFTWARE_WRAP_MODE_V_normalTex).y,l9_0,l9_19);
float l9_20=l9_19;
vec3 l9_21=sc_SamplingCoordsViewToGlobal(vec2(l9_16,l9_18),normalTexLayout,normalTexGetStereoViewIndex());
vec4 l9_22=texture2D(normalTex,l9_21.xy,0.0);
vec4 l9_23;
#if (SC_USE_CLAMP_TO_BORDER_normalTex)
{
l9_23=mix(normalTexBorderColor,l9_22,vec4(l9_20));
}
#else
{
l9_23=l9_22;
}
#endif
Color=l9_23;
vec3 l9_24=(Color.xyz*1.9921875)-vec3(1.0);
Color=vec4(l9_24.x,l9_24.y,l9_24.z,Color.w);
}
void Node111_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_184_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_184_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_184_DROPLIST_ITEM==2)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value2=param_3;
Result=Value2;
}
#else
{
#if (NODE_184_DROPLIST_ITEM==3)
{
vec2 param_8;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),param_8,Globals);
Value3=param_8;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
int detailNormalTexGetStereoViewIndex()
{
int l9_0;
#if (detailNormalTexHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
void Node112_Texture_2D_Sample(vec2 UVCoord,out vec4 Color,ssGlobals Globals)
{
bool l9_0=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_detailNormalTex)!=0));
float l9_1=UVCoord.x;
sc_SoftwareWrapEarly(l9_1,ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).x);
float l9_2=l9_1;
float l9_3=UVCoord.y;
sc_SoftwareWrapEarly(l9_3,ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).y);
float l9_4=l9_3;
vec2 l9_5;
float l9_6;
#if (SC_USE_UV_MIN_MAX_detailNormalTex)
{
bool l9_7;
#if (SC_USE_CLAMP_TO_BORDER_detailNormalTex)
{
l9_7=ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).x==3;
}
#else
{
l9_7=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex)!=0);
}
#endif
float l9_8=l9_2;
float l9_9=1.0;
sc_ClampUV(l9_8,detailNormalTexUvMinMax.x,detailNormalTexUvMinMax.z,l9_7,l9_9);
float l9_10=l9_8;
float l9_11=l9_9;
bool l9_12;
#if (SC_USE_CLAMP_TO_BORDER_detailNormalTex)
{
l9_12=ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).y==3;
}
#else
{
l9_12=(int(SC_USE_CLAMP_TO_BORDER_detailNormalTex)!=0);
}
#endif
float l9_13=l9_4;
float l9_14=l9_11;
sc_ClampUV(l9_13,detailNormalTexUvMinMax.y,detailNormalTexUvMinMax.w,l9_12,l9_14);
l9_6=l9_14;
l9_5=vec2(l9_10,l9_13);
}
#else
{
l9_6=1.0;
l9_5=vec2(l9_2,l9_4);
}
#endif
vec2 l9_15=sc_TransformUV(l9_5,(int(SC_USE_UV_TRANSFORM_detailNormalTex)!=0),detailNormalTexTransform);
float l9_16=l9_15.x;
float l9_17=l9_6;
sc_SoftwareWrapLate(l9_16,ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).x,l9_0,l9_17);
float l9_18=l9_15.y;
float l9_19=l9_17;
sc_SoftwareWrapLate(l9_18,ivec2(SC_SOFTWARE_WRAP_MODE_U_detailNormalTex,SC_SOFTWARE_WRAP_MODE_V_detailNormalTex).y,l9_0,l9_19);
float l9_20=l9_19;
vec3 l9_21=sc_SamplingCoordsViewToGlobal(vec2(l9_16,l9_18),detailNormalTexLayout,detailNormalTexGetStereoViewIndex());
vec4 l9_22=texture2D(detailNormalTex,l9_21.xy,0.0);
vec4 l9_23;
#if (SC_USE_CLAMP_TO_BORDER_detailNormalTex)
{
l9_23=mix(detailNormalTexBorderColor,l9_22,vec4(l9_20));
}
#else
{
l9_23=l9_22;
}
#endif
Color=l9_23;
vec3 l9_24=(Color.xyz*1.9921875)-vec3(1.0);
Color=vec4(l9_24.x,l9_24.y,l9_24.z,Color.w);
}
void Node113_If_else(float Bool1,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
#if (Tweak_N218)
{
vec2 param_6;
Node111_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
vec4 param_9;
Node112_Texture_2D_Sample(param_6,param_9,Globals);
Value1=param_9.xyz;
Result=Value1;
}
#else
{
Result=Default;
}
#endif
}
vec3 ngs_CombineNormals(vec3 Normal1,float Strength1,vec3 Normal2,float Strength2)
{
vec3 l9_0=mix(vec3(0.0,0.0,1.0),Normal1,vec3(Strength1))+vec3(0.0,0.0,1.0);
vec3 l9_1=mix(vec3(0.0,0.0,1.0),Normal2,vec3(Strength2))*vec3(-1.0,-1.0,1.0);
return normalize((l9_0*dot(l9_0,l9_1))-(l9_1*l9_0.z));
}
void Node345_Normalize(vec3 Input0,out vec3 Output,ssGlobals Globals)
{
vec3 l9_0=Input0;
vec3 l9_1=Input0;
float l9_2=dot(l9_0,l9_1);
float l9_3;
if (l9_2>0.0)
{
l9_3=1.0/sqrt(l9_2);
}
else
{
l9_3=0.0;
}
Output=Input0*l9_3;
}
void Node337_If_else(float Bool1,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
#if (Tweak_N354)
{
vec2 param_6;
Node208_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
vec4 param_9;
Node209_Texture_2D_Sample(param_6,param_9,Globals);
vec3 param_14;
Node113_If_else(0.0,vec3(0.0),Port_Default_N113,param_14,Globals);
vec3 param_17;
Node345_Normalize(mat3(Globals.VertexTangent_WorldSpace,Globals.VertexBinormal_WorldSpace,Globals.VertexNormal_WorldSpace)*ngs_CombineNormals(param_9.xyz,Port_Strength1_N200,param_14,Port_Strength2_N200),param_17,Globals);
Value1=param_17;
Result=Value1;
}
#else
{
vec3 param_20;
Node346_Normalize(Globals.VertexNormal_WorldSpace,param_20,Globals);
Default=param_20;
Result=Default;
}
#endif
}
void Node128_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_76_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_76_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_76_DROPLIST_ITEM==2)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value2=param_3;
Result=Value2;
}
#else
{
#if (NODE_76_DROPLIST_ITEM==3)
{
vec2 param_8;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),param_8,Globals);
Value3=param_8;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
int emissiveTexGetStereoViewIndex()
{
int l9_0;
#if (emissiveTexHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
void Node132_If_else(float Bool1,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
#if (Tweak_N223)
{
vec2 param_6;
Node128_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
bool l9_0=(int(SC_USE_CLAMP_TO_BORDER_emissiveTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_emissiveTex)!=0));
float l9_1=param_6.x;
sc_SoftwareWrapEarly(l9_1,ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).x);
float l9_2=l9_1;
float l9_3=param_6.y;
sc_SoftwareWrapEarly(l9_3,ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).y);
float l9_4=l9_3;
vec2 l9_5;
float l9_6;
#if (SC_USE_UV_MIN_MAX_emissiveTex)
{
bool l9_7;
#if (SC_USE_CLAMP_TO_BORDER_emissiveTex)
{
l9_7=ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).x==3;
}
#else
{
l9_7=(int(SC_USE_CLAMP_TO_BORDER_emissiveTex)!=0);
}
#endif
float l9_8=l9_2;
float l9_9=1.0;
sc_ClampUV(l9_8,emissiveTexUvMinMax.x,emissiveTexUvMinMax.z,l9_7,l9_9);
float l9_10=l9_8;
float l9_11=l9_9;
bool l9_12;
#if (SC_USE_CLAMP_TO_BORDER_emissiveTex)
{
l9_12=ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).y==3;
}
#else
{
l9_12=(int(SC_USE_CLAMP_TO_BORDER_emissiveTex)!=0);
}
#endif
float l9_13=l9_4;
float l9_14=l9_11;
sc_ClampUV(l9_13,emissiveTexUvMinMax.y,emissiveTexUvMinMax.w,l9_12,l9_14);
l9_6=l9_14;
l9_5=vec2(l9_10,l9_13);
}
#else
{
l9_6=1.0;
l9_5=vec2(l9_2,l9_4);
}
#endif
vec2 l9_15=sc_TransformUV(l9_5,(int(SC_USE_UV_TRANSFORM_emissiveTex)!=0),emissiveTexTransform);
float l9_16=l9_15.x;
float l9_17=l9_6;
sc_SoftwareWrapLate(l9_16,ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).x,l9_0,l9_17);
float l9_18=l9_15.y;
float l9_19=l9_17;
sc_SoftwareWrapLate(l9_18,ivec2(SC_SOFTWARE_WRAP_MODE_U_emissiveTex,SC_SOFTWARE_WRAP_MODE_V_emissiveTex).y,l9_0,l9_19);
float l9_20=l9_19;
vec3 l9_21=sc_SamplingCoordsViewToGlobal(vec2(l9_16,l9_18),emissiveTexLayout,emissiveTexGetStereoViewIndex());
vec4 l9_22=texture2D(emissiveTex,l9_21.xy,0.0);
vec4 l9_23;
#if (SC_USE_CLAMP_TO_BORDER_emissiveTex)
{
l9_23=mix(emissiveTexBorderColor,l9_22,vec4(l9_20));
}
#else
{
l9_23=l9_22;
}
#endif
Value1=l9_23.xyz;
Result=Value1;
}
#else
{
Result=Default;
}
#endif
}
vec3 ssSRGB_to_Linear(vec3 value)
{
vec3 l9_0;
#if (SC_DEVICE_CLASS>=2)
{
l9_0=vec3(pow(value.x,2.2),pow(value.y,2.2),pow(value.z,2.2));
}
#else
{
l9_0=value*value;
}
#endif
return l9_0;
}
void Node176_Switch(float Switch,vec2 Value0,vec2 Value1,vec2 Value2,vec2 Value3,vec2 Default,out vec2 Result,ssGlobals Globals)
{
#if (NODE_221_DROPLIST_ITEM==0)
{
Value0=Globals.Surface_UVCoord0;
Result=Value0;
}
#else
{
#if (NODE_221_DROPLIST_ITEM==1)
{
Value1=Globals.Surface_UVCoord1;
Result=Value1;
}
#else
{
#if (NODE_221_DROPLIST_ITEM==2)
{
vec2 param_3;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),param_3,Globals);
Value2=param_3;
Result=Value2;
}
#else
{
#if (NODE_221_DROPLIST_ITEM==3)
{
vec2 param_8;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),param_8,Globals);
Value3=param_8;
Result=Value3;
}
#else
{
Default=Globals.Surface_UVCoord0;
Result=Default;
}
#endif
}
#endif
}
#endif
}
#endif
}
int materialParamsTexGetStereoViewIndex()
{
int l9_0;
#if (materialParamsTexHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
void Node188_If_else(float Bool1,vec3 Value1,vec3 Default,out vec3 Result,ssGlobals Globals)
{
#if (NODE_38_DROPLIST_ITEM==3)
{
vec4 l9_0=Globals.VertexColor;
vec2 param_6;
Node176_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_6,Globals);
bool l9_1=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_materialParamsTex)!=0));
float l9_2=param_6.x;
sc_SoftwareWrapEarly(l9_2,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x);
float l9_3=l9_2;
float l9_4=param_6.y;
sc_SoftwareWrapEarly(l9_4,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y);
float l9_5=l9_4;
vec2 l9_6;
float l9_7;
#if (SC_USE_UV_MIN_MAX_materialParamsTex)
{
bool l9_8;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_8=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x==3;
}
#else
{
l9_8=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_9=l9_3;
float l9_10=1.0;
sc_ClampUV(l9_9,materialParamsTexUvMinMax.x,materialParamsTexUvMinMax.z,l9_8,l9_10);
float l9_11=l9_9;
float l9_12=l9_10;
bool l9_13;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_13=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y==3;
}
#else
{
l9_13=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_14=l9_5;
float l9_15=l9_12;
sc_ClampUV(l9_14,materialParamsTexUvMinMax.y,materialParamsTexUvMinMax.w,l9_13,l9_15);
l9_7=l9_15;
l9_6=vec2(l9_11,l9_14);
}
#else
{
l9_7=1.0;
l9_6=vec2(l9_3,l9_5);
}
#endif
vec2 l9_16=sc_TransformUV(l9_6,(int(SC_USE_UV_TRANSFORM_materialParamsTex)!=0),materialParamsTexTransform);
float l9_17=l9_16.x;
float l9_18=l9_7;
sc_SoftwareWrapLate(l9_17,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x,l9_1,l9_18);
float l9_19=l9_16.y;
float l9_20=l9_18;
sc_SoftwareWrapLate(l9_19,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y,l9_1,l9_20);
float l9_21=l9_20;
vec3 l9_22=sc_SamplingCoordsViewToGlobal(vec2(l9_17,l9_19),materialParamsTexLayout,materialParamsTexGetStereoViewIndex());
vec4 l9_23=texture2D(materialParamsTex,l9_22.xy,0.0);
vec4 l9_24;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_24=mix(materialParamsTexBorderColor,l9_23,vec4(l9_21));
}
#else
{
l9_24=l9_23;
}
#endif
Value1=l9_0.xyz*vec3(l9_24.z);
Result=Value1;
}
#else
{
vec2 param_14;
Node176_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_14,Globals);
bool l9_25=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_materialParamsTex)!=0));
float l9_26=param_14.x;
sc_SoftwareWrapEarly(l9_26,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x);
float l9_27=l9_26;
float l9_28=param_14.y;
sc_SoftwareWrapEarly(l9_28,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y);
float l9_29=l9_28;
vec2 l9_30;
float l9_31;
#if (SC_USE_UV_MIN_MAX_materialParamsTex)
{
bool l9_32;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_32=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x==3;
}
#else
{
l9_32=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_33=l9_27;
float l9_34=1.0;
sc_ClampUV(l9_33,materialParamsTexUvMinMax.x,materialParamsTexUvMinMax.z,l9_32,l9_34);
float l9_35=l9_33;
float l9_36=l9_34;
bool l9_37;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_37=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y==3;
}
#else
{
l9_37=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_38=l9_29;
float l9_39=l9_36;
sc_ClampUV(l9_38,materialParamsTexUvMinMax.y,materialParamsTexUvMinMax.w,l9_37,l9_39);
l9_31=l9_39;
l9_30=vec2(l9_35,l9_38);
}
#else
{
l9_31=1.0;
l9_30=vec2(l9_27,l9_29);
}
#endif
vec2 l9_40=sc_TransformUV(l9_30,(int(SC_USE_UV_TRANSFORM_materialParamsTex)!=0),materialParamsTexTransform);
float l9_41=l9_40.x;
float l9_42=l9_31;
sc_SoftwareWrapLate(l9_41,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x,l9_25,l9_42);
float l9_43=l9_40.y;
float l9_44=l9_42;
sc_SoftwareWrapLate(l9_43,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y,l9_25,l9_44);
float l9_45=l9_44;
vec3 l9_46=sc_SamplingCoordsViewToGlobal(vec2(l9_41,l9_43),materialParamsTexLayout,materialParamsTexGetStereoViewIndex());
vec4 l9_47=texture2D(materialParamsTex,l9_46.xy,0.0);
vec4 l9_48;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_48=mix(materialParamsTexBorderColor,l9_47,vec4(l9_45));
}
#else
{
l9_48=l9_47;
}
#endif
Default=vec3(l9_48.z);
Result=Default;
}
#endif
}
vec3 evaluateSSAO(vec3 positionWS)
{
#if (sc_SSAOEnabled)
{
vec4 l9_0=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(positionWS,1.0);
return vec3(texture2D(sc_SSAOTexture,((l9_0.xyz/vec3(l9_0.w)).xy*0.5)+vec2(0.5)).x);
}
#else
{
return vec3(1.0);
}
#endif
}
vec3 fresnelSchlickSub(float cosTheta,vec3 F0,vec3 fresnelMax)
{
float l9_0=1.0-cosTheta;
float l9_1=l9_0*l9_0;
return F0+((fresnelMax-F0)*((l9_1*l9_1)*l9_0));
}
float Dggx(float NdotH,float roughness_1)
{
float l9_0=roughness_1*roughness_1;
float l9_1=l9_0*l9_0;
float l9_2=((NdotH*NdotH)*(l9_1-1.0))+1.0;
return l9_1/((l9_2*l9_2)+9.9999999e-09);
}
vec3 calculateDirectSpecular(SurfaceProperties surfaceProperties,vec3 L,vec3 V)
{
float l9_0=surfaceProperties.roughness;
float l9_1=max(l9_0,0.029999999);
vec3 l9_2=surfaceProperties.specColor;
vec3 l9_3=surfaceProperties.normal;
vec3 l9_4=L;
vec3 l9_5=V;
vec3 l9_6=normalize(l9_4+l9_5);
vec3 l9_7=L;
float l9_8=clamp(dot(l9_3,l9_7),0.0,1.0);
vec3 l9_9=V;
float l9_10=clamp(dot(l9_3,l9_6),0.0,1.0);
vec3 l9_11=V;
float l9_12=clamp(dot(l9_11,l9_6),0.0,1.0);
#if (SC_DEVICE_CLASS>=2)
{
float l9_13=l9_1+1.0;
float l9_14=(l9_13*l9_13)*0.125;
float l9_15=1.0-l9_14;
return fresnelSchlickSub(l9_12,l9_2,vec3(1.0))*(((Dggx(l9_10,l9_1)*(1.0/(((l9_8*l9_15)+l9_14)*((clamp(dot(l9_3,l9_9),0.0,1.0)*l9_15)+l9_14))))*0.25)*l9_8);
}
#else
{
float l9_16=exp2(11.0-(10.0*l9_1));
return ((fresnelSchlickSub(l9_12,l9_2,vec3(1.0))*((l9_16*0.125)+0.25))*pow(l9_10,l9_16))*l9_8;
}
#endif
}
LightingComponents accumulateLight(LightingComponents lighting,LightProperties light,SurfaceProperties surfaceProperties,vec3 V)
{
lighting.directDiffuse+=((vec3(clamp(dot(surfaceProperties.normal,light.direction),0.0,1.0))*light.color)*light.attenuation);
lighting.directSpecular+=((calculateDirectSpecular(surfaceProperties,light.direction,V)*light.color)*light.attenuation);
return lighting;
}
float computeDistanceAttenuation(float distanceToLight,float falloffEndDistance)
{
float l9_0=distanceToLight;
float l9_1=distanceToLight;
float l9_2=l9_0*l9_1;
if (falloffEndDistance==0.0)
{
return 1.0/l9_2;
}
return max(min(1.0-((l9_2*l9_2)/pow(falloffEndDistance,4.0)),1.0),0.0)/l9_2;
}
vec2 calcPanoramicTexCoordsFromDir(vec3 reflDir,float rotationDegrees)
{
float l9_0=-reflDir.z;
vec2 l9_1=vec2((((reflDir.x<0.0) ? (-1.0) : 1.0)*acos(clamp(l9_0/length(vec2(reflDir.x,l9_0)),-1.0,1.0)))-1.5707964,acos(reflDir.y))/vec2(6.2831855,3.1415927);
float l9_2=l9_1.x+(rotationDegrees/360.0);
vec2 l9_3=vec2(l9_2,1.0-l9_1.y);
l9_3.x=fract((l9_2+floor(l9_2))+1.0);
return l9_3;
}
int sc_EnvmapSpecularGetStereoViewIndex()
{
int l9_0;
#if (sc_EnvmapSpecularHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
vec2 calcSeamlessPanoramicUvsForSampling(vec2 uv,vec2 topMipRes,float lod)
{
#if (SC_DEVICE_CLASS>=2)
{
vec2 l9_0=max(vec2(1.0),topMipRes/vec2(exp2(lod)));
return ((uv*(l9_0-vec2(1.0)))/l9_0)+(vec2(0.5)/l9_0);
}
#else
{
return uv;
}
#endif
}
vec3 getSpecularDominantDir(vec3 N,vec3 R,float roughness_1)
{
#if (SC_DEVICE_CLASS>=2)
{
return normalize(mix(R,N,vec3((roughness_1*roughness_1)*roughness_1)));
}
#else
{
return R;
}
#endif
}
vec3 envBRDFApprox(SurfaceProperties surfaceProperties,float NdotV)
{
#if (SC_DEVICE_CLASS>=2)
{
vec4 l9_0=(vec4(-1.0,-0.0275,-0.57200003,0.022)*surfaceProperties.roughness)+vec4(1.0,0.0425,1.04,-0.039999999);
float l9_1=l9_0.x;
vec2 l9_2=(vec2(-1.04,1.04)*((min(l9_1*l9_1,exp2((-9.2799997)*NdotV))*l9_1)+l9_0.y))+l9_0.zw;
return max((surfaceProperties.specColor*l9_2.x)+vec3(l9_2.y),vec3(0.0));
}
#else
{
return fresnelSchlickSub(NdotV,surfaceProperties.specColor,max(vec3(1.0-surfaceProperties.roughness),surfaceProperties.specColor));
}
#endif
}
int sc_ScreenTextureGetStereoViewIndex()
{
int l9_0;
#if (sc_ScreenTextureHasSwappedViews)
{
l9_0=1-sc_GetStereoViewIndex();
}
#else
{
l9_0=sc_GetStereoViewIndex();
}
#endif
return l9_0;
}
vec4 sc_readFragData0_Platform()
{
return getFragData()[0];
}
vec4 sc_GetFramebufferColor()
{
vec4 l9_0;
#if (sc_FramebufferFetch)
{
l9_0=sc_readFragData0_Platform();
}
#else
{
l9_0=texture2D(sc_ScreenTexture,sc_SamplingCoordsViewToGlobal(sc_ScreenCoordsGlobalToView(gl_FragCoord.xy*sc_CurrentRenderTargetDims.zw),sc_ScreenTextureLayout,sc_ScreenTextureGetStereoViewIndex()).xy,0.0);
}
#endif
return l9_0;
}
float srgbToLinear(float x)
{
#if (SC_DEVICE_CLASS>=2)
{
return pow(x,2.2);
}
#else
{
return x*x;
}
#endif
}
float linearToSrgb(float x)
{
#if (SC_DEVICE_CLASS>=2)
{
return pow(x,0.45454547);
}
#else
{
return sqrt(x);
}
#endif
}
float transformSingleColor(float original,float intMap,float target)
{
#if ((BLEND_MODE_REALISTIC||BLEND_MODE_FORGRAY)||BLEND_MODE_NOTBRIGHT)
{
return original/pow(1.0-target,intMap);
}
#else
{
#if (BLEND_MODE_DIVISION)
{
return original/(1.0-target);
}
#else
{
#if (BLEND_MODE_BRIGHT)
{
return original/pow(1.0-target,2.0-(2.0*original));
}
#endif
}
#endif
}
#endif
return 0.0;
}
vec3 RGBtoHCV(vec3 rgb)
{
vec4 l9_0;
if (rgb.y<rgb.z)
{
l9_0=vec4(rgb.zy,-1.0,0.66666669);
}
else
{
l9_0=vec4(rgb.yz,0.0,-0.33333334);
}
vec4 l9_1;
if (rgb.x<l9_0.x)
{
l9_1=vec4(l9_0.xyw,rgb.x);
}
else
{
l9_1=vec4(rgb.x,l9_0.yzx);
}
float l9_2=l9_1.x-min(l9_1.w,l9_1.y);
return vec3(abs(((l9_1.w-l9_1.y)/((6.0*l9_2)+1e-07))+l9_1.z),l9_2,l9_1.x);
}
vec3 RGBToHSL(vec3 rgb)
{
vec3 l9_0=RGBtoHCV(rgb);
float l9_1=l9_0.y;
float l9_2=l9_0.z-(l9_1*0.5);
return vec3(l9_0.x,l9_1/((1.0-abs((2.0*l9_2)-1.0))+1e-07),l9_2);
}
vec3 HUEtoRGB(float hue)
{
return clamp(vec3(abs((6.0*hue)-3.0)-1.0,2.0-abs((6.0*hue)-2.0),2.0-abs((6.0*hue)-4.0)),vec3(0.0),vec3(1.0));
}
vec3 HSLToRGB(vec3 hsl)
{
return ((HUEtoRGB(hsl.x)-vec3(0.5))*((1.0-abs((2.0*hsl.z)-1.0))*hsl.y))+vec3(hsl.z);
}
vec3 transformColor(float yValue,vec3 original,vec3 target,float weight,float intMap)
{
#if (BLEND_MODE_INTENSE)
{
return mix(original,HSLToRGB(vec3(target.x,target.y,RGBToHSL(original).z)),vec3(weight));
}
#else
{
return mix(original,clamp(vec3(transformSingleColor(yValue,intMap,target.x),transformSingleColor(yValue,intMap,target.y),transformSingleColor(yValue,intMap,target.z)),vec3(0.0),vec3(1.0)),vec3(weight));
}
#endif
}
vec3 definedBlend(vec3 a,vec3 b)
{
#if (BLEND_MODE_LIGHTEN)
{
return max(a,b);
}
#else
{
#if (BLEND_MODE_DARKEN)
{
return min(a,b);
}
#else
{
#if (BLEND_MODE_DIVIDE)
{
return b/a;
}
#else
{
#if (BLEND_MODE_AVERAGE)
{
return (a+b)*0.5;
}
#else
{
#if (BLEND_MODE_SUBTRACT)
{
return max((a+b)-vec3(1.0),vec3(0.0));
}
#else
{
#if (BLEND_MODE_DIFFERENCE)
{
return abs(a-b);
}
#else
{
#if (BLEND_MODE_NEGATION)
{
return vec3(1.0)-abs((vec3(1.0)-a)-b);
}
#else
{
#if (BLEND_MODE_EXCLUSION)
{
return (a+b)-((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_OVERLAY)
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1;
if (a.y<0.5)
{
l9_1=(2.0*a.y)*b.y;
}
else
{
l9_1=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_2;
if (a.z<0.5)
{
l9_2=(2.0*a.z)*b.z;
}
else
{
l9_2=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return vec3(l9_0,l9_1,l9_2);
}
#else
{
#if (BLEND_MODE_SOFT_LIGHT)
{
return (((vec3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
#else
{
#if (BLEND_MODE_HARD_LIGHT)
{
float l9_3;
if (b.x<0.5)
{
l9_3=(2.0*b.x)*a.x;
}
else
{
l9_3=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_4;
if (b.y<0.5)
{
l9_4=(2.0*b.y)*a.y;
}
else
{
l9_4=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_5;
if (b.z<0.5)
{
l9_5=(2.0*b.z)*a.z;
}
else
{
l9_5=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return vec3(l9_3,l9_4,l9_5);
}
#else
{
#if (BLEND_MODE_COLOR_DODGE)
{
float l9_6;
if (b.x==1.0)
{
l9_6=b.x;
}
else
{
l9_6=min(a.x/(1.0-b.x),1.0);
}
float l9_7;
if (b.y==1.0)
{
l9_7=b.y;
}
else
{
l9_7=min(a.y/(1.0-b.y),1.0);
}
float l9_8;
if (b.z==1.0)
{
l9_8=b.z;
}
else
{
l9_8=min(a.z/(1.0-b.z),1.0);
}
return vec3(l9_6,l9_7,l9_8);
}
#else
{
#if (BLEND_MODE_COLOR_BURN)
{
float l9_9;
if (b.x==0.0)
{
l9_9=b.x;
}
else
{
l9_9=max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_10;
if (b.y==0.0)
{
l9_10=b.y;
}
else
{
l9_10=max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_11;
if (b.z==0.0)
{
l9_11=b.z;
}
else
{
l9_11=max(1.0-((1.0-a.z)/b.z),0.0);
}
return vec3(l9_9,l9_10,l9_11);
}
#else
{
#if (BLEND_MODE_LINEAR_LIGHT)
{
float l9_12;
if (b.x<0.5)
{
l9_12=max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_12=min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_13;
if (b.y<0.5)
{
l9_13=max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_13=min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_14;
if (b.z<0.5)
{
l9_14=max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_14=min(a.z+(2.0*(b.z-0.5)),1.0);
}
return vec3(l9_12,l9_13,l9_14);
}
#else
{
#if (BLEND_MODE_VIVID_LIGHT)
{
float l9_15;
if (b.x<0.5)
{
float l9_16;
if ((2.0*b.x)==0.0)
{
l9_16=2.0*b.x;
}
else
{
l9_16=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_15=l9_16;
}
else
{
float l9_17;
if ((2.0*(b.x-0.5))==1.0)
{
l9_17=2.0*(b.x-0.5);
}
else
{
l9_17=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_15=l9_17;
}
float l9_18;
if (b.y<0.5)
{
float l9_19;
if ((2.0*b.y)==0.0)
{
l9_19=2.0*b.y;
}
else
{
l9_19=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_18=l9_19;
}
else
{
float l9_20;
if ((2.0*(b.y-0.5))==1.0)
{
l9_20=2.0*(b.y-0.5);
}
else
{
l9_20=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_18=l9_20;
}
float l9_21;
if (b.z<0.5)
{
float l9_22;
if ((2.0*b.z)==0.0)
{
l9_22=2.0*b.z;
}
else
{
l9_22=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_21=l9_22;
}
else
{
float l9_23;
if ((2.0*(b.z-0.5))==1.0)
{
l9_23=2.0*(b.z-0.5);
}
else
{
l9_23=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_21=l9_23;
}
return vec3(l9_15,l9_18,l9_21);
}
#else
{
#if (BLEND_MODE_PIN_LIGHT)
{
float l9_24;
if (b.x<0.5)
{
l9_24=min(a.x,2.0*b.x);
}
else
{
l9_24=max(a.x,2.0*(b.x-0.5));
}
float l9_25;
if (b.y<0.5)
{
l9_25=min(a.y,2.0*b.y);
}
else
{
l9_25=max(a.y,2.0*(b.y-0.5));
}
float l9_26;
if (b.z<0.5)
{
l9_26=min(a.z,2.0*b.z);
}
else
{
l9_26=max(a.z,2.0*(b.z-0.5));
}
return vec3(l9_24,l9_25,l9_26);
}
#else
{
#if (BLEND_MODE_HARD_MIX)
{
float l9_27;
if (b.x<0.5)
{
float l9_28;
if ((2.0*b.x)==0.0)
{
l9_28=2.0*b.x;
}
else
{
l9_28=max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_27=l9_28;
}
else
{
float l9_29;
if ((2.0*(b.x-0.5))==1.0)
{
l9_29=2.0*(b.x-0.5);
}
else
{
l9_29=min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_27=l9_29;
}
bool l9_30=l9_27<0.5;
float l9_31;
if (b.y<0.5)
{
float l9_32;
if ((2.0*b.y)==0.0)
{
l9_32=2.0*b.y;
}
else
{
l9_32=max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_31=l9_32;
}
else
{
float l9_33;
if ((2.0*(b.y-0.5))==1.0)
{
l9_33=2.0*(b.y-0.5);
}
else
{
l9_33=min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_31=l9_33;
}
bool l9_34=l9_31<0.5;
float l9_35;
if (b.z<0.5)
{
float l9_36;
if ((2.0*b.z)==0.0)
{
l9_36=2.0*b.z;
}
else
{
l9_36=max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_35=l9_36;
}
else
{
float l9_37;
if ((2.0*(b.z-0.5))==1.0)
{
l9_37=2.0*(b.z-0.5);
}
else
{
l9_37=min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_35=l9_37;
}
return vec3(l9_30 ? 0.0 : 1.0,l9_34 ? 0.0 : 1.0,(l9_35<0.5) ? 0.0 : 1.0);
}
#else
{
#if (BLEND_MODE_HARD_REFLECT)
{
float l9_38;
if (b.x==1.0)
{
l9_38=b.x;
}
else
{
l9_38=min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_39;
if (b.y==1.0)
{
l9_39=b.y;
}
else
{
l9_39=min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_40;
if (b.z==1.0)
{
l9_40=b.z;
}
else
{
l9_40=min((a.z*a.z)/(1.0-b.z),1.0);
}
return vec3(l9_38,l9_39,l9_40);
}
#else
{
#if (BLEND_MODE_HARD_GLOW)
{
float l9_41;
if (a.x==1.0)
{
l9_41=a.x;
}
else
{
l9_41=min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_42;
if (a.y==1.0)
{
l9_42=a.y;
}
else
{
l9_42=min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_43;
if (a.z==1.0)
{
l9_43=a.z;
}
else
{
l9_43=min((b.z*b.z)/(1.0-a.z),1.0);
}
return vec3(l9_41,l9_42,l9_43);
}
#else
{
#if (BLEND_MODE_HARD_PHOENIX)
{
return (min(a,b)-max(a,b))+vec3(1.0);
}
#else
{
#if (BLEND_MODE_HUE)
{
return HSLToRGB(vec3(RGBToHSL(b).x,RGBToHSL(a).yz));
}
#else
{
#if (BLEND_MODE_SATURATION)
{
vec3 l9_44=RGBToHSL(a);
return HSLToRGB(vec3(l9_44.x,RGBToHSL(b).y,l9_44.z));
}
#else
{
#if (BLEND_MODE_COLOR)
{
return HSLToRGB(vec3(RGBToHSL(b).xy,RGBToHSL(a).z));
}
#else
{
#if (BLEND_MODE_LUMINOSITY)
{
return HSLToRGB(vec3(RGBToHSL(a).xy,RGBToHSL(b).z));
}
#else
{
vec3 l9_45=a;
vec3 l9_46=b;
float l9_47=((0.29899999*l9_45.x)+(0.58700001*l9_45.y))+(0.114*l9_45.z);
int l9_48;
#if (intensityTextureHasSwappedViews)
{
l9_48=1-sc_GetStereoViewIndex();
}
#else
{
l9_48=sc_GetStereoViewIndex();
}
#endif
bool l9_49=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0)&&(!(int(SC_USE_UV_MIN_MAX_intensityTexture)!=0));
float l9_50=pow(l9_47,1.0/correctedIntensity);
sc_SoftwareWrapEarly(l9_50,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x);
float l9_51=l9_50;
float l9_52=0.5;
sc_SoftwareWrapEarly(l9_52,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y);
float l9_53=l9_52;
vec2 l9_54;
float l9_55;
#if (SC_USE_UV_MIN_MAX_intensityTexture)
{
bool l9_56;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_56=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x==3;
}
#else
{
l9_56=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_57=l9_51;
float l9_58=1.0;
sc_ClampUV(l9_57,intensityTextureUvMinMax.x,intensityTextureUvMinMax.z,l9_56,l9_58);
float l9_59=l9_57;
float l9_60=l9_58;
bool l9_61;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_61=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y==3;
}
#else
{
l9_61=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_62=l9_53;
float l9_63=l9_60;
sc_ClampUV(l9_62,intensityTextureUvMinMax.y,intensityTextureUvMinMax.w,l9_61,l9_63);
l9_55=l9_63;
l9_54=vec2(l9_59,l9_62);
}
#else
{
l9_55=1.0;
l9_54=vec2(l9_51,l9_53);
}
#endif
vec2 l9_64=sc_TransformUV(l9_54,(int(SC_USE_UV_TRANSFORM_intensityTexture)!=0),intensityTextureTransform);
float l9_65=l9_64.x;
float l9_66=l9_55;
sc_SoftwareWrapLate(l9_65,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x,l9_49,l9_66);
float l9_67=l9_64.y;
float l9_68=l9_66;
sc_SoftwareWrapLate(l9_67,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y,l9_49,l9_68);
float l9_69=l9_68;
vec3 l9_70=sc_SamplingCoordsViewToGlobal(vec2(l9_65,l9_67),intensityTextureLayout,l9_48);
vec4 l9_71=texture2D(intensityTexture,l9_70.xy,0.0);
vec4 l9_72;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_72=mix(intensityTextureBorderColor,l9_71,vec4(l9_69));
}
#else
{
l9_72=l9_71;
}
#endif
float l9_73=((((l9_72.x*256.0)+l9_72.y)+(l9_72.z/256.0))/257.00391)*16.0;
float l9_74;
#if (BLEND_MODE_FORGRAY)
{
l9_74=max(l9_73,1.0);
}
#else
{
l9_74=l9_73;
}
#endif
float l9_75;
#if (BLEND_MODE_NOTBRIGHT)
{
l9_75=min(l9_74,1.0);
}
#else
{
l9_75=l9_74;
}
#endif
return transformColor(l9_47,l9_45,l9_46,1.0,l9_75);
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
vec4 sc_OutputMotionVectorsIfNeeded(vec3 surfacePosWorldSpace,vec4 finalColor)
{
#if (sc_MotionVectorsPass)
{
vec4 l9_0=vec4(surfacePosWorldSpace,1.0);
vec4 l9_1=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*l9_0;
vec4 l9_2=((sc_PrevFrameViewProjectionMatrixArray[sc_GetStereoViewIndex()]*sc_PrevFrameModelMatrix)*sc_ModelMatrixInverse)*l9_0;
vec2 l9_3=((l9_1.xy/vec2(l9_1.w)).xy-(l9_2.xy/vec2(l9_2.w)).xy)*0.5;
float l9_4=floor(((l9_3.x*5.0)+0.5)*65535.0);
float l9_5=floor(l9_4*0.00390625);
float l9_6=floor(((l9_3.y*5.0)+0.5)*65535.0);
float l9_7=floor(l9_6*0.00390625);
return vec4(l9_5/255.0,(l9_4-(l9_5*256.0))/255.0,l9_7/255.0,(l9_6-(l9_7*256.0))/255.0);
}
#else
{
return finalColor;
}
#endif
}
void sc_writeFragData0Internal(vec4 col,float zero,int cacheConst)
{
col.x+=zero*float(cacheConst);
sc_FragData0=col;
}
float getFrontLayerZTestEpsilon()
{
#if (sc_SkinBonesCount>0)
{
return 5e-07;
}
#else
{
return 5.0000001e-08;
}
#endif
}
void unpackValues(float channel,int passIndex,inout int values[8])
{
#if (sc_OITCompositingPass)
{
channel=floor((channel*255.0)+0.5);
int l9_0=((passIndex+1)*4)-1;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_0>=(passIndex*4))
{
values[l9_0]=(values[l9_0]*4)+int(floor(mod(channel,4.0)));
channel=floor(channel/4.0);
l9_0--;
continue;
}
else
{
break;
}
}
}
#endif
}
float getDepthOrderingEpsilon()
{
#if (sc_SkinBonesCount>0)
{
return 0.001;
}
#else
{
return 0.0;
}
#endif
}
int encodeDepth(float depth,vec2 depthBounds)
{
float l9_0=(1.0-depthBounds.x)*1000.0;
return int(clamp((depth-l9_0)/((depthBounds.y*1000.0)-l9_0),0.0,1.0)*65535.0);
}
float viewSpaceDepth()
{
#if (UseViewSpaceDepthVariant&&((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass))
{
return varViewSpaceDepth;
}
#else
{
return sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][3].z/(sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][2].z+((gl_FragCoord.z*2.0)-1.0));
}
#endif
}
float packValue(inout int value)
{
#if (sc_OITDepthGatherPass)
{
int l9_0=value;
value/=4;
return floor(floor(mod(float(l9_0),4.0))*64.0)/255.0;
}
#else
{
return 0.0;
}
#endif
}
void sc_writeFragData1(vec4 col)
{
#if sc_FragDataCount>=2
sc_FragData1=col;
#endif
}
void sc_writeFragData2(vec4 col)
{
#if sc_FragDataCount>=3
sc_FragData2=col;
#endif
}
void main()
{
#if (sc_DepthOnly)
{
return;
}
#endif
#if ((sc_StereoRenderingMode==1)&&(sc_StereoRendering_IsClipDistanceEnabled==0))
{
if (varClipDistance<0.0)
{
discard;
}
}
#endif
vec2 l9_0=gl_FragCoord.xy*sc_CurrentRenderTargetDims.zw;
vec2 l9_1=sc_ScreenCoordsGlobalToView(l9_0);
vec3 l9_2=normalize(varTangent.xyz);
vec3 l9_3=normalize(varNormal);
vec3 l9_4=normalize(sc_Camera.position-varPos);
ssGlobals l9_5=ssGlobals(sc_Time.x,sc_Time.y,0.0,vec3(0.0),l9_4,varPos,varColor,varPackedTex.xy,varPackedTex.zw,l9_1,l9_2,l9_3,cross(l9_3,l9_2)*varTangent.w,varPos);
vec4 l9_6;
#if (NODE_38_DROPLIST_ITEM==1)
{
vec3 l9_7;
Node80_If_else(0.0,vec3(0.0),vec3(0.0),l9_7,l9_5);
l9_6=varColor*vec4(l9_7.x,l9_7.y,l9_7.z,vec4(0.0).w);
}
#else
{
vec3 l9_8;
Node80_If_else(0.0,vec3(0.0),vec3(0.0),l9_8,l9_5);
l9_6=vec4(l9_8.x,l9_8.y,l9_8.z,vec4(0.0).w);
}
#endif
vec4 param_3;
Node369_If_else(0.0,vec4(0.0),Port_Default_N369,param_3,l9_5);
vec4 l9_9=param_3;
float l9_10;
#if (Tweak_N308)
{
vec2 l9_11;
#if (NODE_69_DROPLIST_ITEM==0)
{
l9_11=varPackedTex.xy;
}
#else
{
vec2 l9_12;
#if (NODE_69_DROPLIST_ITEM==1)
{
l9_12=varPackedTex.zw;
}
#else
{
vec2 l9_13;
#if (NODE_69_DROPLIST_ITEM==2)
{
vec2 l9_14;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),l9_14,l9_5);
l9_13=l9_14;
}
#else
{
vec2 l9_15;
#if (NODE_69_DROPLIST_ITEM==3)
{
vec2 l9_16;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),l9_16,l9_5);
l9_15=l9_16;
}
#else
{
l9_15=varPackedTex.xy;
}
#endif
l9_13=l9_15;
}
#endif
l9_12=l9_13;
}
#endif
l9_11=l9_12;
}
#endif
int l9_17;
#if (opacityTexHasSwappedViews)
{
l9_17=1-sc_GetStereoViewIndex();
}
#else
{
l9_17=sc_GetStereoViewIndex();
}
#endif
bool l9_18=(int(SC_USE_CLAMP_TO_BORDER_opacityTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_opacityTex)!=0));
float l9_19=l9_11.x;
sc_SoftwareWrapEarly(l9_19,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).x);
float l9_20=l9_19;
float l9_21=l9_11.y;
sc_SoftwareWrapEarly(l9_21,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).y);
float l9_22=l9_21;
vec2 l9_23;
float l9_24;
#if (SC_USE_UV_MIN_MAX_opacityTex)
{
bool l9_25;
#if (SC_USE_CLAMP_TO_BORDER_opacityTex)
{
l9_25=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).x==3;
}
#else
{
l9_25=(int(SC_USE_CLAMP_TO_BORDER_opacityTex)!=0);
}
#endif
float l9_26=l9_20;
float l9_27=1.0;
sc_ClampUV(l9_26,opacityTexUvMinMax.x,opacityTexUvMinMax.z,l9_25,l9_27);
float l9_28=l9_26;
float l9_29=l9_27;
bool l9_30;
#if (SC_USE_CLAMP_TO_BORDER_opacityTex)
{
l9_30=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).y==3;
}
#else
{
l9_30=(int(SC_USE_CLAMP_TO_BORDER_opacityTex)!=0);
}
#endif
float l9_31=l9_22;
float l9_32=l9_29;
sc_ClampUV(l9_31,opacityTexUvMinMax.y,opacityTexUvMinMax.w,l9_30,l9_32);
l9_24=l9_32;
l9_23=vec2(l9_28,l9_31);
}
#else
{
l9_24=1.0;
l9_23=vec2(l9_20,l9_22);
}
#endif
vec2 l9_33=sc_TransformUV(l9_23,(int(SC_USE_UV_TRANSFORM_opacityTex)!=0),opacityTexTransform);
float l9_34=l9_33.x;
float l9_35=l9_24;
sc_SoftwareWrapLate(l9_34,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).x,l9_18,l9_35);
float l9_36=l9_33.y;
float l9_37=l9_35;
sc_SoftwareWrapLate(l9_36,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTex,SC_SOFTWARE_WRAP_MODE_V_opacityTex).y,l9_18,l9_37);
float l9_38=l9_37;
vec3 l9_39=sc_SamplingCoordsViewToGlobal(vec2(l9_34,l9_36),opacityTexLayout,l9_17);
vec4 l9_40=texture2D(opacityTex,l9_39.xy,0.0);
vec4 l9_41;
#if (SC_USE_CLAMP_TO_BORDER_opacityTex)
{
l9_41=mix(opacityTexBorderColor,l9_40,vec4(l9_38));
}
#else
{
l9_41=l9_40;
}
#endif
l9_10=l9_41.x;
}
#else
{
l9_10=Port_Default_N204;
}
#endif
float l9_42;
#if (NODE_38_DROPLIST_ITEM==1)
{
l9_42=varColor.w;
}
#else
{
l9_42=Port_Input2_N072;
}
#endif
float l9_43=(baseColor*l9_9).w*l9_10;
float l9_44=l9_43*l9_42;
vec3 param_8;
Node337_If_else(0.0,vec3(0.0),vec3(0.0),param_8,l9_5);
vec3 l9_45=param_8;
vec3 l9_46;
#if ((NODE_38_DROPLIST_ITEM==2)||Tweak_N223)
{
vec3 l9_47;
#if (NODE_38_DROPLIST_ITEM==2)
{
vec3 l9_48;
Node132_If_else(0.0,vec3(0.0),Port_Default_N132,l9_48,l9_5);
l9_47=varColor.xyz+l9_48;
}
#else
{
vec3 l9_49;
Node132_If_else(0.0,vec3(0.0),Port_Default_N132,l9_49,l9_5);
l9_47=l9_49;
}
#endif
l9_46=ssSRGB_to_Linear((l9_47*emissiveColor)*vec3(emissiveIntensity));
}
#else
{
l9_46=Port_Default_N103;
}
#endif
vec3 l9_50;
#if (Tweak_N179)
{
vec3 l9_51;
Node337_If_else(0.0,vec3(0.0),vec3(0.0),l9_51,l9_5);
vec3 l9_52=l9_51;
vec3 l9_53=reflect(l9_4,l9_52)*Port_Input1_N257;
float l9_54=l9_53.x;
float l9_55=l9_53.y;
float l9_56=l9_53.z+Port_Input1_N264;
float l9_57=((l9_54*l9_54)+(l9_55*l9_55))+(l9_56*l9_56);
float l9_58;
if (l9_57<=0.0)
{
l9_58=0.0;
}
else
{
l9_58=sqrt(l9_57);
}
float l9_59=l9_58*Port_Input1_N268;
vec2 l9_60=vec2(1.0)-((vec2(l9_54,l9_55)/vec2(l9_59))+vec2(Port_Input1_N270));
int l9_61;
#if (reflectionTexHasSwappedViews)
{
l9_61=1-sc_GetStereoViewIndex();
}
#else
{
l9_61=sc_GetStereoViewIndex();
}
#endif
bool l9_62=(int(SC_USE_CLAMP_TO_BORDER_reflectionTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_reflectionTex)!=0));
float l9_63=l9_60.x;
sc_SoftwareWrapEarly(l9_63,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).x);
float l9_64=l9_63;
float l9_65=l9_60.y;
sc_SoftwareWrapEarly(l9_65,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).y);
float l9_66=l9_65;
vec2 l9_67;
float l9_68;
#if (SC_USE_UV_MIN_MAX_reflectionTex)
{
bool l9_69;
#if (SC_USE_CLAMP_TO_BORDER_reflectionTex)
{
l9_69=ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).x==3;
}
#else
{
l9_69=(int(SC_USE_CLAMP_TO_BORDER_reflectionTex)!=0);
}
#endif
float l9_70=l9_64;
float l9_71=1.0;
sc_ClampUV(l9_70,reflectionTexUvMinMax.x,reflectionTexUvMinMax.z,l9_69,l9_71);
float l9_72=l9_70;
float l9_73=l9_71;
bool l9_74;
#if (SC_USE_CLAMP_TO_BORDER_reflectionTex)
{
l9_74=ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).y==3;
}
#else
{
l9_74=(int(SC_USE_CLAMP_TO_BORDER_reflectionTex)!=0);
}
#endif
float l9_75=l9_66;
float l9_76=l9_73;
sc_ClampUV(l9_75,reflectionTexUvMinMax.y,reflectionTexUvMinMax.w,l9_74,l9_76);
l9_68=l9_76;
l9_67=vec2(l9_72,l9_75);
}
#else
{
l9_68=1.0;
l9_67=vec2(l9_64,l9_66);
}
#endif
vec2 l9_77=sc_TransformUV(l9_67,(int(SC_USE_UV_TRANSFORM_reflectionTex)!=0),reflectionTexTransform);
float l9_78=l9_77.x;
float l9_79=l9_68;
sc_SoftwareWrapLate(l9_78,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).x,l9_62,l9_79);
float l9_80=l9_77.y;
float l9_81=l9_79;
sc_SoftwareWrapLate(l9_80,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionTex,SC_SOFTWARE_WRAP_MODE_V_reflectionTex).y,l9_62,l9_81);
float l9_82=l9_81;
vec3 l9_83=sc_SamplingCoordsViewToGlobal(vec2(l9_78,l9_80),reflectionTexLayout,l9_61);
vec4 l9_84=texture2D(reflectionTex,l9_83.xy,0.0);
vec4 l9_85;
#if (SC_USE_CLAMP_TO_BORDER_reflectionTex)
{
l9_85=mix(reflectionTexBorderColor,l9_84,vec4(l9_82));
}
#else
{
l9_85=l9_84;
}
#endif
vec3 l9_86;
#if (Tweak_N177)
{
vec2 l9_87;
#if (NODE_228_DROPLIST_ITEM==0)
{
l9_87=varPackedTex.xy;
}
#else
{
vec2 l9_88;
#if (NODE_228_DROPLIST_ITEM==1)
{
l9_88=varPackedTex.zw;
}
#else
{
vec2 l9_89;
#if (NODE_228_DROPLIST_ITEM==2)
{
vec2 l9_90;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),l9_90,l9_5);
l9_89=l9_90;
}
#else
{
vec2 l9_91;
#if (NODE_228_DROPLIST_ITEM==3)
{
vec2 l9_92;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),l9_92,l9_5);
l9_91=l9_92;
}
#else
{
l9_91=varPackedTex.xy;
}
#endif
l9_89=l9_91;
}
#endif
l9_88=l9_89;
}
#endif
l9_87=l9_88;
}
#endif
int l9_93;
#if (reflectionModulationTexHasSwappedViews)
{
l9_93=1-sc_GetStereoViewIndex();
}
#else
{
l9_93=sc_GetStereoViewIndex();
}
#endif
bool l9_94=(int(SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_reflectionModulationTex)!=0));
float l9_95=l9_87.x;
sc_SoftwareWrapEarly(l9_95,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).x);
float l9_96=l9_95;
float l9_97=l9_87.y;
sc_SoftwareWrapEarly(l9_97,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).y);
float l9_98=l9_97;
vec2 l9_99;
float l9_100;
#if (SC_USE_UV_MIN_MAX_reflectionModulationTex)
{
bool l9_101;
#if (SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)
{
l9_101=ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).x==3;
}
#else
{
l9_101=(int(SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)!=0);
}
#endif
float l9_102=l9_96;
float l9_103=1.0;
sc_ClampUV(l9_102,reflectionModulationTexUvMinMax.x,reflectionModulationTexUvMinMax.z,l9_101,l9_103);
float l9_104=l9_102;
float l9_105=l9_103;
bool l9_106;
#if (SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)
{
l9_106=ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).y==3;
}
#else
{
l9_106=(int(SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)!=0);
}
#endif
float l9_107=l9_98;
float l9_108=l9_105;
sc_ClampUV(l9_107,reflectionModulationTexUvMinMax.y,reflectionModulationTexUvMinMax.w,l9_106,l9_108);
l9_100=l9_108;
l9_99=vec2(l9_104,l9_107);
}
#else
{
l9_100=1.0;
l9_99=vec2(l9_96,l9_98);
}
#endif
vec2 l9_109=sc_TransformUV(l9_99,(int(SC_USE_UV_TRANSFORM_reflectionModulationTex)!=0),reflectionModulationTexTransform);
float l9_110=l9_109.x;
float l9_111=l9_100;
sc_SoftwareWrapLate(l9_110,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).x,l9_94,l9_111);
float l9_112=l9_109.y;
float l9_113=l9_111;
sc_SoftwareWrapLate(l9_112,ivec2(SC_SOFTWARE_WRAP_MODE_U_reflectionModulationTex,SC_SOFTWARE_WRAP_MODE_V_reflectionModulationTex).y,l9_94,l9_113);
float l9_114=l9_113;
vec3 l9_115=sc_SamplingCoordsViewToGlobal(vec2(l9_110,l9_112),reflectionModulationTexLayout,l9_93);
vec4 l9_116=texture2D(reflectionModulationTex,l9_115.xy,0.0);
vec4 l9_117;
#if (SC_USE_CLAMP_TO_BORDER_reflectionModulationTex)
{
l9_117=mix(reflectionModulationTexBorderColor,l9_116,vec4(l9_114));
}
#else
{
l9_117=l9_116;
}
#endif
l9_86=l9_117.xyz;
}
#else
{
l9_86=Port_Default_N041;
}
#endif
l9_50=vec3(reflectionIntensity)*ssSRGB_to_Linear(l9_85.xyz*l9_86);
}
#else
{
l9_50=Port_Default_N134;
}
#endif
vec3 l9_118;
#if (Tweak_N74)
{
vec3 l9_119;
#if (Tweak_N216)
{
vec2 l9_120;
#if (NODE_315_DROPLIST_ITEM==0)
{
l9_120=varPackedTex.xy;
}
#else
{
vec2 l9_121;
#if (NODE_315_DROPLIST_ITEM==1)
{
l9_121=varPackedTex.zw;
}
#else
{
vec2 l9_122;
#if (NODE_315_DROPLIST_ITEM==2)
{
vec2 l9_123;
Node1_If_else(0.0,vec2(0.0),vec2(0.0),l9_123,l9_5);
l9_122=l9_123;
}
#else
{
vec2 l9_124;
#if (NODE_315_DROPLIST_ITEM==3)
{
vec2 l9_125;
Node35_If_else(0.0,vec2(0.0),vec2(0.0),l9_125,l9_5);
l9_124=l9_125;
}
#else
{
l9_124=varPackedTex.xy;
}
#endif
l9_122=l9_124;
}
#endif
l9_121=l9_122;
}
#endif
l9_120=l9_121;
}
#endif
int l9_126;
#if (rimColorTexHasSwappedViews)
{
l9_126=1-sc_GetStereoViewIndex();
}
#else
{
l9_126=sc_GetStereoViewIndex();
}
#endif
bool l9_127=(int(SC_USE_CLAMP_TO_BORDER_rimColorTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_rimColorTex)!=0));
float l9_128=l9_120.x;
sc_SoftwareWrapEarly(l9_128,ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).x);
float l9_129=l9_128;
float l9_130=l9_120.y;
sc_SoftwareWrapEarly(l9_130,ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).y);
float l9_131=l9_130;
vec2 l9_132;
float l9_133;
#if (SC_USE_UV_MIN_MAX_rimColorTex)
{
bool l9_134;
#if (SC_USE_CLAMP_TO_BORDER_rimColorTex)
{
l9_134=ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).x==3;
}
#else
{
l9_134=(int(SC_USE_CLAMP_TO_BORDER_rimColorTex)!=0);
}
#endif
float l9_135=l9_129;
float l9_136=1.0;
sc_ClampUV(l9_135,rimColorTexUvMinMax.x,rimColorTexUvMinMax.z,l9_134,l9_136);
float l9_137=l9_135;
float l9_138=l9_136;
bool l9_139;
#if (SC_USE_CLAMP_TO_BORDER_rimColorTex)
{
l9_139=ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).y==3;
}
#else
{
l9_139=(int(SC_USE_CLAMP_TO_BORDER_rimColorTex)!=0);
}
#endif
float l9_140=l9_131;
float l9_141=l9_138;
sc_ClampUV(l9_140,rimColorTexUvMinMax.y,rimColorTexUvMinMax.w,l9_139,l9_141);
l9_133=l9_141;
l9_132=vec2(l9_137,l9_140);
}
#else
{
l9_133=1.0;
l9_132=vec2(l9_129,l9_131);
}
#endif
vec2 l9_142=sc_TransformUV(l9_132,(int(SC_USE_UV_TRANSFORM_rimColorTex)!=0),rimColorTexTransform);
float l9_143=l9_142.x;
float l9_144=l9_133;
sc_SoftwareWrapLate(l9_143,ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).x,l9_127,l9_144);
float l9_145=l9_142.y;
float l9_146=l9_144;
sc_SoftwareWrapLate(l9_145,ivec2(SC_SOFTWARE_WRAP_MODE_U_rimColorTex,SC_SOFTWARE_WRAP_MODE_V_rimColorTex).y,l9_127,l9_146);
float l9_147=l9_146;
vec3 l9_148=sc_SamplingCoordsViewToGlobal(vec2(l9_143,l9_145),rimColorTexLayout,l9_126);
vec4 l9_149=texture2D(rimColorTex,l9_148.xy,0.0);
vec4 l9_150;
#if (SC_USE_CLAMP_TO_BORDER_rimColorTex)
{
l9_150=mix(rimColorTexBorderColor,l9_149,vec4(l9_147));
}
#else
{
l9_150=l9_149;
}
#endif
l9_119=l9_150.xyz;
}
#else
{
l9_119=Port_Default_N170;
}
#endif
vec3 l9_151=ssSRGB_to_Linear((rimColor*vec3(rimIntensity))*l9_119);
float l9_152;
#if (rimInvert)
{
vec3 l9_153;
Node337_If_else(0.0,vec3(0.0),vec3(0.0),l9_153,l9_5);
l9_152=abs(dot(l9_153,-l9_4));
}
#else
{
vec3 l9_154;
Node337_If_else(0.0,vec3(0.0),vec3(0.0),l9_154,l9_5);
l9_152=1.0-abs(dot(l9_154,-l9_4));
}
#endif
float l9_155;
if (l9_152<=0.0)
{
l9_155=0.0;
}
else
{
l9_155=pow(l9_152,rimExponent);
}
l9_118=l9_151*vec3(l9_155);
}
#else
{
l9_118=Port_Default_N173;
}
#endif
vec3 l9_156=l9_46+l9_50;
vec3 l9_157=l9_156+l9_118;
vec3 l9_158;
#if (SC_DEVICE_CLASS>=2)
{
l9_158=vec3(pow(l9_157.x,0.45454544),pow(l9_157.y,0.45454544),pow(l9_157.z,0.45454544));
}
#else
{
l9_158=sqrt(l9_157);
}
#endif
vec2 param_16;
Node176_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),param_16,l9_5);
bool l9_159=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0)&&(!(int(SC_USE_UV_MIN_MAX_materialParamsTex)!=0));
float l9_160=param_16.x;
sc_SoftwareWrapEarly(l9_160,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x);
float l9_161=l9_160;
float l9_162=param_16.y;
sc_SoftwareWrapEarly(l9_162,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y);
float l9_163=l9_162;
vec2 l9_164;
float l9_165;
#if (SC_USE_UV_MIN_MAX_materialParamsTex)
{
bool l9_166;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_166=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x==3;
}
#else
{
l9_166=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_167=l9_161;
float l9_168=1.0;
sc_ClampUV(l9_167,materialParamsTexUvMinMax.x,materialParamsTexUvMinMax.z,l9_166,l9_168);
float l9_169=l9_167;
float l9_170=l9_168;
bool l9_171;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_171=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y==3;
}
#else
{
l9_171=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_172=l9_163;
float l9_173=l9_170;
sc_ClampUV(l9_172,materialParamsTexUvMinMax.y,materialParamsTexUvMinMax.w,l9_171,l9_173);
l9_165=l9_173;
l9_164=vec2(l9_169,l9_172);
}
#else
{
l9_165=1.0;
l9_164=vec2(l9_161,l9_163);
}
#endif
vec2 l9_174=sc_TransformUV(l9_164,(int(SC_USE_UV_TRANSFORM_materialParamsTex)!=0),materialParamsTexTransform);
float l9_175=l9_174.x;
float l9_176=l9_165;
sc_SoftwareWrapLate(l9_175,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x,l9_159,l9_176);
float l9_177=l9_174.y;
float l9_178=l9_176;
sc_SoftwareWrapLate(l9_177,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y,l9_159,l9_178);
float l9_179=l9_178;
vec3 l9_180=sc_SamplingCoordsViewToGlobal(vec2(l9_175,l9_177),materialParamsTexLayout,materialParamsTexGetStereoViewIndex());
vec4 l9_181=texture2D(materialParamsTex,l9_180.xy,0.0);
vec4 l9_182;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_182=mix(materialParamsTexBorderColor,l9_181,vec4(l9_179));
}
#else
{
l9_182=l9_181;
}
#endif
vec3 param_21;
Node188_If_else(0.0,vec3(0.0),vec3(0.0),param_21,l9_5);
vec3 l9_183=param_21;
vec3 l9_184;
#if (Tweak_N179)
{
l9_184=Port_Value1_N079;
}
#else
{
vec3 l9_185;
#if (Tweak_N219)
{
vec2 l9_186;
Node176_Switch(0.0,vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),vec2(0.0),l9_186,l9_5);
float l9_187=l9_186.x;
sc_SoftwareWrapEarly(l9_187,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x);
float l9_188=l9_187;
float l9_189=l9_186.y;
sc_SoftwareWrapEarly(l9_189,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y);
float l9_190=l9_189;
vec2 l9_191;
float l9_192;
#if (SC_USE_UV_MIN_MAX_materialParamsTex)
{
bool l9_193;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_193=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x==3;
}
#else
{
l9_193=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_194=l9_188;
float l9_195=1.0;
sc_ClampUV(l9_194,materialParamsTexUvMinMax.x,materialParamsTexUvMinMax.z,l9_193,l9_195);
float l9_196=l9_194;
float l9_197=l9_195;
bool l9_198;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_198=ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y==3;
}
#else
{
l9_198=(int(SC_USE_CLAMP_TO_BORDER_materialParamsTex)!=0);
}
#endif
float l9_199=l9_190;
float l9_200=l9_197;
sc_ClampUV(l9_199,materialParamsTexUvMinMax.y,materialParamsTexUvMinMax.w,l9_198,l9_200);
l9_192=l9_200;
l9_191=vec2(l9_196,l9_199);
}
#else
{
l9_192=1.0;
l9_191=vec2(l9_188,l9_190);
}
#endif
vec2 l9_201=sc_TransformUV(l9_191,(int(SC_USE_UV_TRANSFORM_materialParamsTex)!=0),materialParamsTexTransform);
float l9_202=l9_201.x;
float l9_203=l9_192;
sc_SoftwareWrapLate(l9_202,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).x,l9_159,l9_203);
float l9_204=l9_201.y;
float l9_205=l9_203;
sc_SoftwareWrapLate(l9_204,ivec2(SC_SOFTWARE_WRAP_MODE_U_materialParamsTex,SC_SOFTWARE_WRAP_MODE_V_materialParamsTex).y,l9_159,l9_205);
float l9_206=l9_205;
vec3 l9_207=sc_SamplingCoordsViewToGlobal(vec2(l9_202,l9_204),materialParamsTexLayout,materialParamsTexGetStereoViewIndex());
vec4 l9_208=texture2D(materialParamsTex,l9_207.xy,0.0);
vec4 l9_209;
#if (SC_USE_CLAMP_TO_BORDER_materialParamsTex)
{
l9_209=mix(materialParamsTexBorderColor,l9_208,vec4(l9_206));
}
#else
{
l9_209=l9_208;
}
#endif
vec3 l9_210=vec3(metallic*l9_209.x);
vec3 l9_211=mix(Port_Input0_N239,Port_Import_N235*l9_210,l9_210);
vec3 l9_212;
Node188_If_else(0.0,vec3(0.0),vec3(0.0),l9_212,l9_5);
l9_185=mix(Port_Input0_N325,mix((vec3(1.0-specularAoDarkening)*l9_211)*l9_211,Port_Input1_N322,l9_212),vec3(specularAoIntensity));
}
#else
{
l9_185=Port_Default_N326;
}
#endif
l9_184=l9_185;
}
#endif
vec3 l9_213;
#if (!sc_ProjectiveShadowsCaster)
{
l9_213=l9_45;
}
#else
{
l9_213=vec3(0.0);
}
#endif
float l9_214=clamp(l9_44,0.0,1.0);
#if (sc_BlendMode_AlphaTest)
{
if (l9_214<alphaTestThreshold)
{
discard;
}
}
#endif
#if (ENABLE_STIPPLE_PATTERN_TEST)
{
if (l9_214<((mod(dot(floor(mod(gl_FragCoord.xy,vec2(4.0))),vec2(4.0,1.0))*9.0,16.0)+1.0)/17.0))
{
discard;
}
}
#endif
vec3 l9_215=max(l9_6.xyz,vec3(0.0));
vec4 l9_216;
#if (sc_ProjectiveShadowsCaster)
{
l9_216=vec4(l9_215,l9_214);
}
#else
{
float l9_217=clamp(metallic*l9_182.x,0.0,1.0);
float l9_218=clamp(roughness*l9_182.y,0.0,1.0);
vec3 l9_219=clamp(l9_184,vec3(0.0),vec3(1.0));
vec3 l9_220=ssSRGB_to_Linear(l9_215);
vec3 l9_221=normalize(l9_213);
vec3 l9_222=ssSRGB_to_Linear(max(l9_158,vec3(0.0)));
vec3 l9_223;
#if (sc_SSAOEnabled)
{
l9_223=evaluateSSAO(varPos);
}
#else
{
l9_223=clamp(l9_183,vec3(0.0),vec3(1.0));
}
#endif
vec3 l9_224=vec3(l9_217);
vec3 l9_225=mix(vec3(0.039999999),l9_220*l9_217,l9_224);
vec3 l9_226=mix(l9_220*(1.0-l9_217),vec3(0.0),l9_224);
SurfaceProperties l9_227=SurfaceProperties(l9_226,l9_214,l9_221,varPos,l9_4,l9_217,l9_218,l9_222,l9_223,l9_219,vec3(1.0),l9_225);
vec4 l9_228=vec4(1.0);
vec3 l9_229;
vec3 l9_230;
vec3 l9_231;
vec3 l9_232;
int l9_233;
vec3 l9_234;
vec3 l9_235;
#if (sc_DirectionalLightsCount>0)
{
vec3 l9_236;
vec3 l9_237;
vec3 l9_238;
vec3 l9_239;
int l9_240;
vec3 l9_241;
vec3 l9_242;
l9_242=vec3(1.0);
l9_241=vec3(0.0);
l9_240=0;
l9_239=vec3(0.0);
l9_238=vec3(0.0);
l9_237=vec3(0.0);
l9_236=vec3(0.0);
LightingComponents l9_243;
LightProperties l9_244;
SurfaceProperties l9_245;
vec3 l9_246;
int l9_247=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_247<sc_DirectionalLightsCount)
{
LightingComponents l9_248=accumulateLight(LightingComponents(l9_236,l9_237,l9_242,l9_241,l9_239,l9_238),LightProperties(sc_DirectionalLights[l9_247].direction,sc_DirectionalLights[l9_247].color.xyz,sc_DirectionalLights[l9_247].color.w*l9_228[(l9_240<3) ? l9_240 : 3]),l9_227,l9_4);
l9_242=l9_248.indirectDiffuse;
l9_241=l9_248.indirectSpecular;
l9_240++;
l9_239=l9_248.emitted;
l9_238=l9_248.transmitted;
l9_237=l9_248.directSpecular;
l9_236=l9_248.directDiffuse;
l9_247++;
continue;
}
else
{
break;
}
}
l9_235=l9_242;
l9_234=l9_241;
l9_233=l9_240;
l9_232=l9_239;
l9_231=l9_238;
l9_230=l9_237;
l9_229=l9_236;
}
#else
{
l9_235=vec3(1.0);
l9_234=vec3(0.0);
l9_233=0;
l9_232=vec3(0.0);
l9_231=vec3(0.0);
l9_230=vec3(0.0);
l9_229=vec3(0.0);
}
#endif
vec3 l9_249;
vec3 l9_250;
vec3 l9_251;
#if (sc_PointLightsCount>0)
{
vec3 l9_252;
vec3 l9_253;
vec3 l9_254;
vec3 l9_255;
vec3 l9_256;
vec3 l9_257;
l9_257=l9_235;
l9_256=l9_234;
l9_255=l9_232;
l9_254=l9_231;
l9_253=l9_230;
l9_252=l9_229;
int l9_258;
vec3 l9_259;
vec3 l9_260;
vec3 l9_261;
vec3 l9_262;
vec3 l9_263;
vec3 l9_264;
int l9_265=0;
int l9_266=l9_233;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_265<sc_PointLightsCount)
{
vec3 l9_267=sc_PointLights[l9_265].position-varPos;
vec3 l9_268=normalize(l9_267);
float l9_269=l9_228[(l9_266<3) ? l9_266 : 3];
float l9_270=clamp((dot(l9_268,sc_PointLights[l9_265].direction)*sc_PointLights[l9_265].angleScale)+sc_PointLights[l9_265].angleOffset,0.0,1.0);
float l9_271=(sc_PointLights[l9_265].color.w*l9_269)*(l9_270*l9_270);
float l9_272;
if (sc_PointLights[l9_265].falloffEnabled)
{
l9_272=l9_271*computeDistanceAttenuation(length(l9_267),sc_PointLights[l9_265].falloffEndDistance);
}
else
{
l9_272=l9_271;
}
l9_258=l9_266+1;
LightingComponents l9_273=accumulateLight(LightingComponents(l9_252,l9_253,l9_257,l9_256,l9_255,l9_254),LightProperties(l9_268,sc_PointLights[l9_265].color.xyz,l9_272),l9_227,l9_4);
l9_259=l9_273.directDiffuse;
l9_260=l9_273.directSpecular;
l9_261=l9_273.indirectDiffuse;
l9_262=l9_273.indirectSpecular;
l9_263=l9_273.emitted;
l9_264=l9_273.transmitted;
l9_257=l9_261;
l9_256=l9_262;
l9_266=l9_258;
l9_255=l9_263;
l9_254=l9_264;
l9_253=l9_260;
l9_252=l9_259;
l9_265++;
continue;
}
else
{
break;
}
}
l9_251=l9_254;
l9_250=l9_253;
l9_249=l9_252;
}
#else
{
l9_251=l9_231;
l9_250=l9_230;
l9_249=l9_229;
}
#endif
vec3 l9_274;
vec3 l9_275;
#if (sc_ProjectiveShadowsReceiver)
{
vec3 l9_276;
#if (sc_ProjectiveShadowsReceiver)
{
vec2 l9_277=abs(varShadowTex-vec2(0.5));
vec4 l9_278=texture2D(sc_ShadowTexture,varShadowTex)*step(max(l9_277.x,l9_277.y),0.5);
l9_276=mix(vec3(1.0),mix(sc_ShadowColor.xyz,sc_ShadowColor.xyz*l9_278.xyz,vec3(sc_ShadowColor.w)),vec3(l9_278.w*sc_ShadowDensity));
}
#else
{
l9_276=vec3(1.0);
}
#endif
l9_275=l9_249*l9_276;
l9_274=l9_250*l9_276;
}
#else
{
l9_275=l9_249;
l9_274=l9_250;
}
#endif
vec3 l9_279;
#if ((sc_EnvLightMode==sc_AmbientLightMode_EnvironmentMap)||(sc_EnvLightMode==sc_AmbientLightMode_FromCamera))
{
vec2 l9_280=calcPanoramicTexCoordsFromDir(l9_221,sc_EnvmapRotation.y);
vec4 l9_281;
#if (sc_EnvLightMode==sc_AmbientLightMode_FromCamera)
{
vec2 l9_282;
#if (SC_DEVICE_CLASS>=2)
{
l9_282=calcSeamlessPanoramicUvsForSampling(l9_280,sc_EnvmapSpecularSize.xy,5.0);
}
#else
{
l9_282=l9_280;
}
#endif
l9_281=texture2D(sc_EnvmapSpecular,sc_SamplingCoordsViewToGlobal(l9_282,sc_EnvmapSpecularLayout,sc_EnvmapSpecularGetStereoViewIndex()).xy,13.0);
}
#else
{
vec4 l9_283;
#if (sc_HasDiffuseEnvmap)
{
vec2 l9_284=calcSeamlessPanoramicUvsForSampling(l9_280,sc_EnvmapDiffuseSize.xy,0.0);
int l9_285;
#if (sc_EnvmapDiffuseHasSwappedViews)
{
l9_285=1-sc_GetStereoViewIndex();
}
#else
{
l9_285=sc_GetStereoViewIndex();
}
#endif
l9_283=texture2D(sc_EnvmapDiffuse,sc_SamplingCoordsViewToGlobal(l9_284,sc_EnvmapDiffuseLayout,l9_285).xy,-13.0);
}
#else
{
l9_283=texture2D(sc_EnvmapSpecular,sc_SamplingCoordsViewToGlobal(l9_280,sc_EnvmapSpecularLayout,sc_EnvmapSpecularGetStereoViewIndex()).xy,13.0);
}
#endif
l9_281=l9_283;
}
#endif
l9_279=(l9_281.xyz*(1.0/l9_281.w))*sc_EnvmapExposure;
}
#else
{
vec3 l9_286;
#if (sc_EnvLightMode==sc_AmbientLightMode_SphericalHarmonics)
{
vec3 l9_287=-l9_221;
float l9_288=l9_287.x;
float l9_289=l9_287.y;
float l9_290=l9_287.z;
l9_286=(((((((sc_Sh[8]*0.42904299)*((l9_288*l9_288)-(l9_289*l9_289)))+((sc_Sh[6]*0.74312502)*(l9_290*l9_290)))+(sc_Sh[0]*0.88622701))-(sc_Sh[6]*0.24770799))+((((sc_Sh[4]*(l9_288*l9_289))+(sc_Sh[7]*(l9_288*l9_290)))+(sc_Sh[5]*(l9_289*l9_290)))*0.85808599))+((((sc_Sh[3]*l9_288)+(sc_Sh[1]*l9_289))+(sc_Sh[2]*l9_290))*1.0233279))*sc_ShIntensity;
}
#else
{
l9_286=vec3(0.0);
}
#endif
l9_279=l9_286;
}
#endif
vec3 l9_291;
#if (sc_AmbientLightsCount>0)
{
vec3 l9_292;
#if (sc_AmbientLightMode0==sc_AmbientLightMode_Constant)
{
l9_292=l9_279+(sc_AmbientLights[0].color*sc_AmbientLights[0].intensity);
}
#else
{
vec3 l9_293=l9_279;
l9_293.x=l9_279.x+(1e-06*sc_AmbientLights[0].color.x);
l9_292=l9_293;
}
#endif
l9_291=l9_292;
}
#else
{
l9_291=l9_279;
}
#endif
vec3 l9_294;
#if (sc_AmbientLightsCount>1)
{
vec3 l9_295;
#if (sc_AmbientLightMode1==sc_AmbientLightMode_Constant)
{
l9_295=l9_291+(sc_AmbientLights[1].color*sc_AmbientLights[1].intensity);
}
#else
{
vec3 l9_296=l9_291;
l9_296.x=l9_291.x+(1e-06*sc_AmbientLights[1].color.x);
l9_295=l9_296;
}
#endif
l9_294=l9_295;
}
#else
{
l9_294=l9_291;
}
#endif
vec3 l9_297;
#if (sc_AmbientLightsCount>2)
{
vec3 l9_298;
#if (sc_AmbientLightMode2==sc_AmbientLightMode_Constant)
{
l9_298=l9_294+(sc_AmbientLights[2].color*sc_AmbientLights[2].intensity);
}
#else
{
vec3 l9_299=l9_294;
l9_299.x=l9_294.x+(1e-06*sc_AmbientLights[2].color.x);
l9_298=l9_299;
}
#endif
l9_297=l9_298;
}
#else
{
l9_297=l9_294;
}
#endif
vec3 l9_300;
#if (sc_LightEstimation)
{
vec3 l9_301;
l9_301=sc_LightEstimationData.ambientLight;
vec3 l9_302;
int l9_303=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_303<sc_LightEstimationSGCount)
{
float l9_304=dot(sc_LightEstimationData.sg[l9_303].axis,l9_221);
float l9_305=exp(-sc_LightEstimationData.sg[l9_303].sharpness);
float l9_306=l9_305*l9_305;
float l9_307=1.0/sc_LightEstimationData.sg[l9_303].sharpness;
float l9_308=(1.0+(2.0*l9_306))-l9_307;
float l9_309=sqrt(1.0-l9_308);
float l9_310=0.36000001*l9_304;
float l9_311=(1.0/(4.0*0.36000001))*l9_309;
float l9_312=l9_310+l9_311;
float l9_313;
if (step(abs(l9_310),l9_311)>0.5)
{
l9_313=(l9_312*l9_312)/l9_309;
}
else
{
l9_313=clamp(l9_304,0.0,1.0);
}
l9_302=l9_301+((((sc_LightEstimationData.sg[l9_303].color/vec3(sc_LightEstimationData.sg[l9_303].sharpness))*6.2831855)*((l9_308*l9_313)+(((l9_305-l9_306)*l9_307)-l9_306)))/vec3(3.1415927));
l9_301=l9_302;
l9_303++;
continue;
}
else
{
break;
}
}
l9_300=l9_297+l9_301;
}
#else
{
l9_300=l9_297;
}
#endif
vec3 l9_314;
#if ((sc_EnvLightMode==sc_AmbientLightMode_EnvironmentMap)||(sc_EnvLightMode==sc_AmbientLightMode_FromCamera))
{
float l9_315=clamp(pow(l9_218,0.66666669),0.0,1.0)*5.0;
vec2 l9_316=calcPanoramicTexCoordsFromDir(getSpecularDominantDir(l9_221,reflect(-l9_4,l9_221),l9_218),sc_EnvmapRotation.y);
vec4 l9_317;
#if (SC_DEVICE_CLASS>=2)
{
float l9_318=floor(l9_315);
float l9_319=ceil(l9_315);
l9_317=mix(texture2DLod(sc_EnvmapSpecular,sc_SamplingCoordsViewToGlobal(calcSeamlessPanoramicUvsForSampling(l9_316,sc_EnvmapSpecularSize.xy,l9_318),sc_EnvmapSpecularLayout,sc_EnvmapSpecularGetStereoViewIndex()).xy,l9_318),texture2DLod(sc_EnvmapSpecular,sc_SamplingCoordsViewToGlobal(calcSeamlessPanoramicUvsForSampling(l9_316,sc_EnvmapSpecularSize.xy,l9_319),sc_EnvmapSpecularLayout,sc_EnvmapSpecularGetStereoViewIndex()).xy,l9_319),vec4(l9_315-l9_318));
}
#else
{
l9_317=texture2DLod(sc_EnvmapSpecular,sc_SamplingCoordsViewToGlobal(l9_316,sc_EnvmapSpecularLayout,sc_EnvmapSpecularGetStereoViewIndex()).xy,l9_315);
}
#endif
l9_314=vec3(0.0)+((((l9_317.xyz*(1.0/l9_317.w))*sc_EnvmapExposure)+vec3(1e-06))*envBRDFApprox(l9_227,abs(dot(l9_221,l9_4))));
}
#else
{
l9_314=vec3(0.0);
}
#endif
vec3 l9_320;
#if (sc_LightEstimation)
{
float l9_321=clamp(l9_218*l9_218,0.0099999998,1.0);
vec3 l9_322;
l9_322=sc_LightEstimationData.ambientLight*l9_225;
int l9_323=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_323<sc_LightEstimationSGCount)
{
float l9_324=l9_321*l9_321;
vec3 l9_325=reflect(-l9_4,l9_221);
float l9_326=dot(l9_221,l9_4);
float l9_327=(2.0/l9_324)/(4.0*max(l9_326,9.9999997e-05));
float l9_328=length((l9_325*l9_327)+(sc_LightEstimationData.sg[l9_323].axis*sc_LightEstimationData.sg[l9_323].sharpness));
float l9_329=clamp(dot(l9_221,l9_325),0.0,1.0);
float l9_330=clamp(l9_326,0.0,1.0);
float l9_331=1.0-l9_324;
l9_322+=((((((((vec3(1.0/(3.1415927*l9_324))*exp((l9_328-l9_327)-sc_LightEstimationData.sg[l9_323].sharpness))*sc_LightEstimationData.sg[l9_323].color)*6.2831855)*(1.0-exp((-2.0)*l9_328)))/vec3(l9_328))*((1.0/(l9_329+sqrt(l9_324+((l9_331*l9_329)*l9_329))))*(1.0/(l9_330+sqrt(l9_324+((l9_331*l9_330)*l9_330))))))*(l9_225+((vec3(1.0)-l9_225)*pow(1.0-clamp(dot(l9_325,normalize(l9_325+l9_4)),0.0,1.0),5.0))))*l9_329);
l9_323++;
continue;
}
else
{
break;
}
}
l9_320=l9_314+l9_322;
}
#else
{
l9_320=l9_314;
}
#endif
float l9_332;
vec3 l9_333;
vec3 l9_334;
vec3 l9_335;
#if (sc_BlendMode_ColoredGlass)
{
l9_335=vec3(0.0);
l9_334=vec3(0.0);
l9_333=ssSRGB_to_Linear(sc_GetFramebufferColor().xyz)*mix(vec3(1.0),l9_226,vec3(l9_214));
l9_332=1.0;
}
#else
{
l9_335=l9_275;
l9_334=l9_300;
l9_333=l9_251;
l9_332=l9_214;
}
#endif
bool l9_336;
#if (sc_BlendMode_PremultipliedAlpha)
{
l9_336=true;
}
#else
{
l9_336=false;
}
#endif
vec3 l9_337=l9_334*l9_223;
vec3 l9_338=l9_335+l9_337;
vec3 l9_339=l9_226*l9_338;
vec3 l9_340=l9_320*l9_219;
vec3 l9_341=l9_274+l9_340;
vec3 l9_342;
if (l9_336)
{
l9_342=l9_339*srgbToLinear(l9_332);
}
else
{
l9_342=l9_339;
}
vec3 l9_343=l9_342+l9_341;
vec3 l9_344=(l9_343+l9_222)+l9_333;
float l9_345=l9_344.x;
vec4 l9_346=vec4(l9_345,l9_344.yz,l9_332);
vec4 l9_347;
#if (sc_IsEditor)
{
vec4 l9_348=l9_346;
l9_348.x=l9_345+((l9_223.x*l9_219.x)*9.9999997e-06);
l9_347=l9_348;
}
#else
{
l9_347=l9_346;
}
#endif
vec4 l9_349;
#if (!sc_BlendMode_Multiply)
{
vec3 l9_350=l9_347.xyz*1.8;
vec3 l9_351=(l9_347.xyz*(l9_350+vec3(1.4)))/((l9_347.xyz*(l9_350+vec3(0.5)))+vec3(1.5));
l9_349=vec4(l9_351.x,l9_351.y,l9_351.z,l9_347.w);
}
#else
{
l9_349=l9_347;
}
#endif
vec3 l9_352=vec3(linearToSrgb(l9_349.x),linearToSrgb(l9_349.y),linearToSrgb(l9_349.z));
l9_216=vec4(l9_352.x,l9_352.y,l9_352.z,l9_349.w);
}
#endif
vec4 l9_353=max(l9_216,vec4(0.0));
vec4 l9_354;
#if (sc_ProjectiveShadowsCaster)
{
float l9_355;
#if (((sc_BlendMode_Normal||sc_BlendMode_AlphaToCoverage)||sc_BlendMode_PremultipliedAlphaHardware)||sc_BlendMode_PremultipliedAlphaAuto)
{
l9_355=l9_353.w;
}
#else
{
float l9_356;
#if (sc_BlendMode_PremultipliedAlpha)
{
l9_356=clamp(l9_353.w*2.0,0.0,1.0);
}
#else
{
float l9_357;
#if (sc_BlendMode_AddWithAlphaFactor)
{
l9_357=clamp(dot(l9_353.xyz,vec3(l9_353.w)),0.0,1.0);
}
#else
{
float l9_358;
#if (sc_BlendMode_AlphaTest)
{
l9_358=1.0;
}
#else
{
float l9_359;
#if (sc_BlendMode_Multiply)
{
l9_359=(1.0-dot(l9_353.xyz,vec3(0.33333001)))*l9_353.w;
}
#else
{
float l9_360;
#if (sc_BlendMode_MultiplyOriginal)
{
l9_360=(1.0-clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0))*l9_353.w;
}
#else
{
float l9_361;
#if (sc_BlendMode_ColoredGlass)
{
l9_361=clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0)*l9_353.w;
}
#else
{
float l9_362;
#if (sc_BlendMode_Add)
{
l9_362=clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
float l9_363;
#if (sc_BlendMode_AddWithAlphaFactor)
{
l9_363=clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0)*l9_353.w;
}
#else
{
float l9_364;
#if (sc_BlendMode_Screen)
{
l9_364=dot(l9_353.xyz,vec3(0.33333001))*l9_353.w;
}
#else
{
float l9_365;
#if (sc_BlendMode_Min)
{
l9_365=1.0-clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
float l9_366;
#if (sc_BlendMode_Max)
{
l9_366=clamp(dot(l9_353.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
l9_366=1.0;
}
#endif
l9_365=l9_366;
}
#endif
l9_364=l9_365;
}
#endif
l9_363=l9_364;
}
#endif
l9_362=l9_363;
}
#endif
l9_361=l9_362;
}
#endif
l9_360=l9_361;
}
#endif
l9_359=l9_360;
}
#endif
l9_358=l9_359;
}
#endif
l9_357=l9_358;
}
#endif
l9_356=l9_357;
}
#endif
l9_355=l9_356;
}
#endif
l9_354=vec4(mix(sc_ShadowColor.xyz,sc_ShadowColor.xyz*l9_353.xyz,vec3(sc_ShadowColor.w)),sc_ShadowDensity*l9_355);
}
#else
{
vec4 l9_367;
#if (sc_RenderAlphaToColor)
{
l9_367=vec4(l9_353.w);
}
#else
{
vec4 l9_368;
#if (sc_BlendMode_Custom)
{
vec3 l9_369=sc_GetFramebufferColor().xyz;
vec3 l9_370=mix(l9_369,definedBlend(l9_369,l9_353.xyz).xyz,vec3(l9_353.w));
vec4 l9_371=vec4(l9_370.x,l9_370.y,l9_370.z,vec4(0.0).w);
l9_371.w=1.0;
l9_368=l9_371;
}
#else
{
vec4 l9_372;
#if (sc_Voxelization)
{
l9_372=vec4(varScreenPos.xyz,1.0);
}
#else
{
vec4 l9_373;
#if (sc_OutputBounds)
{
float l9_374=clamp(abs(gl_FragCoord.z),0.0,1.0);
l9_373=vec4(l9_374,1.0-l9_374,1.0,1.0);
}
#else
{
vec4 l9_375;
#if (sc_BlendMode_MultiplyOriginal)
{
float l9_376=l9_353.w;
l9_375=vec4(mix(vec3(1.0),l9_353.xyz,vec3(l9_376)),l9_376);
}
#else
{
vec4 l9_377;
#if (sc_BlendMode_Screen||sc_BlendMode_PremultipliedAlphaAuto)
{
float l9_378=l9_353.w;
float l9_379;
#if (sc_BlendMode_PremultipliedAlphaAuto)
{
l9_379=clamp(l9_378,0.0,1.0);
}
#else
{
l9_379=l9_378;
}
#endif
l9_377=vec4(l9_353.xyz*l9_379,l9_379);
}
#else
{
l9_377=l9_353;
}
#endif
l9_375=l9_377;
}
#endif
l9_373=l9_375;
}
#endif
l9_372=l9_373;
}
#endif
l9_368=l9_372;
}
#endif
l9_367=l9_368;
}
#endif
l9_354=l9_367;
}
#endif
vec4 l9_380;
if (PreviewEnabled==1)
{
vec4 l9_381;
if (((PreviewVertexSaved*1.0)!=0.0) ? true : false)
{
l9_381=PreviewVertexColor;
}
else
{
l9_381=vec4(0.0);
}
l9_380=l9_381;
}
else
{
l9_380=l9_354;
}
vec4 l9_382=sc_OutputMotionVectorsIfNeeded(varPos,max(l9_380,vec4(0.0)));
vec4 l9_383=clamp(l9_382,vec4(0.0),vec4(1.0));
#if (sc_OITDepthBoundsPass)
{
#if (sc_OITDepthBoundsPass)
{
float l9_384=clamp(viewSpaceDepth()/1000.0,0.0,1.0);
sc_writeFragData0Internal(vec4(max(0.0,1.0-(l9_384-0.0039215689)),min(1.0,l9_384+0.0039215689),0.0,0.0),sc_UniformConstants.x,sc_ShaderCacheConstant);
}
#endif
}
#else
{
#if (sc_OITDepthPrepass)
{
sc_writeFragData0Internal(vec4(1.0),sc_UniformConstants.x,sc_ShaderCacheConstant);
}
#else
{
#if (sc_OITDepthGatherPass)
{
#if (sc_OITDepthGatherPass)
{
vec2 l9_385=sc_ScreenCoordsGlobalToView(l9_0);
#if (sc_OITMaxLayers4Plus1)
{
if ((gl_FragCoord.z-texture2D(sc_OITFrontDepthTexture,l9_385).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
int l9_386=encodeDepth(viewSpaceDepth(),texture2D(sc_OITFilteredDepthBoundsTexture,l9_385).xy);
float l9_387=packValue(l9_386);
int l9_394=int(l9_383.w*255.0);
float l9_395=packValue(l9_394);
sc_writeFragData0Internal(vec4(packValue(l9_386),packValue(l9_386),packValue(l9_386),packValue(l9_386)),sc_UniformConstants.x,sc_ShaderCacheConstant);
sc_writeFragData1(vec4(l9_387,packValue(l9_386),packValue(l9_386),packValue(l9_386)));
sc_writeFragData2(vec4(l9_395,packValue(l9_394),packValue(l9_394),packValue(l9_394)));
#if (sc_OITMaxLayersVisualizeLayerCount)
{
sc_writeFragData2(vec4(0.0039215689,0.0,0.0,0.0));
}
#endif
}
#endif
}
#else
{
#if (sc_OITCompositingPass)
{
#if (sc_OITCompositingPass)
{
vec2 l9_398=sc_ScreenCoordsGlobalToView(l9_0);
#if (sc_OITMaxLayers4Plus1)
{
if ((gl_FragCoord.z-texture2D(sc_OITFrontDepthTexture,l9_398).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
int l9_399[8];
int l9_400[8];
int l9_401=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_401<8)
{
l9_399[l9_401]=0;
l9_400[l9_401]=0;
l9_401++;
continue;
}
else
{
break;
}
}
int l9_402;
#if (sc_OITMaxLayers8)
{
l9_402=2;
}
#else
{
l9_402=1;
}
#endif
int l9_403=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_403<l9_402)
{
vec4 l9_404;
vec4 l9_405;
vec4 l9_406;
if (l9_403==0)
{
l9_406=texture2D(sc_OITAlpha0,l9_398);
l9_405=texture2D(sc_OITDepthLow0,l9_398);
l9_404=texture2D(sc_OITDepthHigh0,l9_398);
}
else
{
l9_406=vec4(0.0);
l9_405=vec4(0.0);
l9_404=vec4(0.0);
}
vec4 l9_407;
vec4 l9_408;
vec4 l9_409;
if (l9_403==1)
{
l9_409=texture2D(sc_OITAlpha1,l9_398);
l9_408=texture2D(sc_OITDepthLow1,l9_398);
l9_407=texture2D(sc_OITDepthHigh1,l9_398);
}
else
{
l9_409=l9_406;
l9_408=l9_405;
l9_407=l9_404;
}
if (any(notEqual(l9_407,vec4(0.0)))||any(notEqual(l9_408,vec4(0.0))))
{
int l9_410[8]=l9_399;
unpackValues(l9_407.w,l9_403,l9_410);
unpackValues(l9_407.z,l9_403,l9_410);
unpackValues(l9_407.y,l9_403,l9_410);
unpackValues(l9_407.x,l9_403,l9_410);
unpackValues(l9_408.w,l9_403,l9_410);
unpackValues(l9_408.z,l9_403,l9_410);
unpackValues(l9_408.y,l9_403,l9_410);
unpackValues(l9_408.x,l9_403,l9_410);
int l9_419[8]=l9_400;
unpackValues(l9_409.w,l9_403,l9_419);
unpackValues(l9_409.z,l9_403,l9_419);
unpackValues(l9_409.y,l9_403,l9_419);
unpackValues(l9_409.x,l9_403,l9_419);
}
l9_403++;
continue;
}
else
{
break;
}
}
vec4 l9_424=texture2D(sc_OITFilteredDepthBoundsTexture,l9_398);
vec2 l9_425=l9_424.xy;
int l9_426;
#if (sc_SkinBonesCount>0)
{
l9_426=encodeDepth(((1.0-l9_424.x)*1000.0)+getDepthOrderingEpsilon(),l9_425);
}
#else
{
l9_426=0;
}
#endif
int l9_427=encodeDepth(viewSpaceDepth(),l9_425);
vec4 l9_428;
l9_428=l9_383*l9_383.w;
vec4 l9_429;
int l9_430=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_430<8)
{
int l9_431=l9_399[l9_430];
int l9_432=l9_427-l9_426;
bool l9_433=l9_431<l9_432;
bool l9_434;
if (l9_433)
{
l9_434=l9_399[l9_430]>0;
}
else
{
l9_434=l9_433;
}
if (l9_434)
{
vec3 l9_435=l9_428.xyz*(1.0-(float(l9_400[l9_430])/255.0));
l9_429=vec4(l9_435.x,l9_435.y,l9_435.z,l9_428.w);
}
else
{
l9_429=l9_428;
}
l9_428=l9_429;
l9_430++;
continue;
}
else
{
break;
}
}
sc_writeFragData0Internal(l9_428,sc_UniformConstants.x,sc_ShaderCacheConstant);
#if (sc_OITMaxLayersVisualizeLayerCount)
{
discard;
}
#endif
}
#endif
}
#else
{
#if (sc_OITFrontLayerPass)
{
#if (sc_OITFrontLayerPass)
{
if (abs(gl_FragCoord.z-texture2D(sc_OITFrontDepthTexture,sc_ScreenCoordsGlobalToView(l9_0)).x)>getFrontLayerZTestEpsilon())
{
discard;
}
sc_writeFragData0Internal(l9_383,sc_UniformConstants.x,sc_ShaderCacheConstant);
}
#endif
}
#else
{
sc_writeFragData0Internal(l9_382,sc_UniformConstants.x,sc_ShaderCacheConstant);
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif
}
#endif // #elif defined FRAGMENT_SHADER // #if defined VERTEX_SHADER
