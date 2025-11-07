#version 430
//#include <required.glsl> // [HACK 4/6/2023] See SCC shader_merger.cpp
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
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
//sampler sampler intensityTextureSmpSC 0:16
//sampler sampler opacityTextureSmpSC 0:17
//sampler sampler sc_OITCommonSampler 0:20
//sampler sampler sc_ScreenTextureSmpSC 0:22
//texture texture2D intensityTexture 0:0:0:16
//texture texture2D opacityTexture 0:1:0:17
//texture texture2D sc_OITAlpha0 0:4:0:20
//texture texture2D sc_OITAlpha1 0:5:0:20
//texture texture2D sc_OITDepthHigh0 0:6:0:20
//texture texture2D sc_OITDepthHigh1 0:7:0:20
//texture texture2D sc_OITDepthLow0 0:8:0:20
//texture texture2D sc_OITDepthLow1 0:9:0:20
//texture texture2D sc_OITFilteredDepthBoundsTexture 0:10:0:20
//texture texture2D sc_OITFrontDepthTexture 0:11:0:20
//texture texture2D sc_ScreenTexture 0:13:0:22
//texture texture2DArray intensityTextureArrSC 0:25:0:16
//texture texture2DArray opacityTextureArrSC 0:26:0:17
//texture texture2DArray sc_ScreenTextureArrSC 0:29:0:22
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
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 31 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_opacityTexture 32 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 33 0
//spec_const bool SC_USE_UV_MIN_MAX_opacityTexture 34 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 35 0
//spec_const bool SC_USE_UV_TRANSFORM_opacityTexture 36 0
//spec_const bool Tweak_N12 37 0
//spec_const bool Tweak_N130 38 0
//spec_const bool Tweak_N68 39 0
//spec_const bool Tweak_N75 40 0
//spec_const bool Tweak_N76 41 0
//spec_const bool Tweak_N87 42 0
//spec_const bool Tweak_N89 43 0
//spec_const bool UseViewSpaceDepthVariant 44 1
//spec_const bool animated 45 0
//spec_const bool intensityTextureHasSwappedViews 46 0
//spec_const bool opacityTextureHasSwappedViews 47 0
//spec_const bool sc_BlendMode_Add 48 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 49 0
//spec_const bool sc_BlendMode_AlphaTest 50 0
//spec_const bool sc_BlendMode_AlphaToCoverage 51 0
//spec_const bool sc_BlendMode_ColoredGlass 52 0
//spec_const bool sc_BlendMode_Custom 53 0
//spec_const bool sc_BlendMode_Max 54 0
//spec_const bool sc_BlendMode_Min 55 0
//spec_const bool sc_BlendMode_Multiply 56 0
//spec_const bool sc_BlendMode_MultiplyOriginal 57 0
//spec_const bool sc_BlendMode_Normal 58 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 59 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 60 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 61 0
//spec_const bool sc_BlendMode_Screen 62 0
//spec_const bool sc_DepthOnly 63 0
//spec_const bool sc_FramebufferFetch 64 0
//spec_const bool sc_MotionVectorsPass 65 0
//spec_const bool sc_OITCompositingPass 66 0
//spec_const bool sc_OITDepthBoundsPass 67 0
//spec_const bool sc_OITDepthGatherPass 68 0
//spec_const bool sc_OITDepthPrepass 69 0
//spec_const bool sc_OITFrontLayerPass 70 0
//spec_const bool sc_OITMaxLayers4Plus1 71 0
//spec_const bool sc_OITMaxLayers8 72 0
//spec_const bool sc_OITMaxLayersVisualizeLayerCount 73 0
//spec_const bool sc_OutputBounds 74 0
//spec_const bool sc_ProjectiveShadowsCaster 75 0
//spec_const bool sc_ProjectiveShadowsReceiver 76 0
//spec_const bool sc_RenderAlphaToColor 77 0
//spec_const bool sc_ScreenTextureHasSwappedViews 78 0
//spec_const bool sc_TAAEnabled 79 0
//spec_const bool sc_VertexBlending 80 0
//spec_const bool sc_VertexBlendingUseNormals 81 0
//spec_const bool sc_Voxelization 82 0
//spec_const int SC_DEVICE_CLASS 83 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 84 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_U_opacityTexture 85 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 86 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_opacityTexture 87 -1
//spec_const int intensityTextureLayout 88 0
//spec_const int opacityTextureLayout 89 0
//spec_const int sc_DepthBufferMode 90 0
//spec_const int sc_RenderingSpace 91 -1
//spec_const int sc_ScreenTextureLayout 92 0
//spec_const int sc_ShaderCacheConstant 93 0
//spec_const int sc_SkinBonesCount 94 0
//spec_const int sc_StereoRenderingMode 95 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 96 0
//spec_const int sc_StereoViewID 97 0
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
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
vec3 SurfacePosition_ObjectSpace;
vec3 VertexNormal_WorldSpace;
vec3 VertexNormal_ObjectSpace;
vec2 gTriplanarCoords;
vec3 SurfacePosition_WorldSpace;
vec2 gScreenCoord;
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
#ifndef SC_DEVICE_CLASS
#define SC_DEVICE_CLASS -1
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
#ifndef Tweak_N75
#define Tweak_N75 0
#elif Tweak_N75==1
#undef Tweak_N75
#define Tweak_N75 1
#endif
#ifndef Tweak_N76
#define Tweak_N76 0
#elif Tweak_N76==1
#undef Tweak_N76
#define Tweak_N76 1
#endif
#ifndef Tweak_N87
#define Tweak_N87 0
#elif Tweak_N87==1
#undef Tweak_N87
#define Tweak_N87 1
#endif
#ifndef Tweak_N130
#define Tweak_N130 0
#elif Tweak_N130==1
#undef Tweak_N130
#define Tweak_N130 1
#endif
#ifndef animated
#define animated 0
#elif animated==1
#undef animated
#define animated 1
#endif
#ifndef Tweak_N68
#define Tweak_N68 0
#elif Tweak_N68==1
#undef Tweak_N68
#define Tweak_N68 1
#endif
#ifndef Tweak_N89
#define Tweak_N89 0
#elif Tweak_N89==1
#undef Tweak_N89
#define Tweak_N89 1
#endif
uniform mat4 sc_ModelMatrix;
uniform mat4 sc_ProjectorMatrix;
uniform vec2 sc_TAAJitterOffset;
uniform int sc_FallbackInstanceID;
uniform vec4 sc_StereoClipPlanes[sc_NumStereoViews];
uniform vec4 sc_UniformConstants;
uniform vec4 sc_BoneMatrices[(sc_SkinBonesCount*3)+1];
uniform mat3 sc_SkinBonesNormalMatrices[sc_SkinBonesCount+1];
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
uniform float glitchFrequency;
uniform float glitchSpeed;
uniform float glitchOffset;
uniform float Port_RangeMinA_N002;
uniform float Port_RangeMaxA_N002;
uniform float Port_RangeMaxB_N002;
uniform float Port_RangeMinB_N002;
uniform float Port_RangeMinA_N103;
uniform float Port_RangeMaxA_N103;
uniform float Port_RangeMaxB_N103;
uniform float Port_RangeMinB_N103;
uniform float glitchIntensity;
uniform float glitchScale;
uniform float Port_Input0_N009;
uniform float Port_Import_N181;
uniform float Port_Input1_N182;
uniform float Port_Input2_N182;
uniform vec3 sc_LocalAabbMax;
uniform vec3 sc_LocalAabbMin;
uniform float Port_Import_N174;
uniform vec2 Port_Scale_N164;
uniform float Port_RangeMinA_N034;
uniform float Port_RangeMaxA_N034;
uniform float Port_RangeMaxB_N034;
uniform float Port_RangeMinB_N034;
uniform float Port_Input1_N055;
uniform float Port_Input1_N056;
uniform float Port_Input1_N066;
uniform float Port_Import_N203;
uniform float Port_Input1_N140;
uniform float Port_Input1_N141;
uniform float Port_Input2_N110;
uniform float Port_Input1_N117;
uniform float thickLines;
uniform float scanlineSpeed;
uniform float Port_RangeMinA_N063;
uniform float Port_RangeMaxA_N063;
uniform float Port_RangeMaxB_N063;
uniform float Port_RangeMinB_N063;
uniform float Offset;
uniform float Port_RangeMinA_N067;
uniform float Port_RangeMaxA_N067;
uniform float Port_RangeMaxB_N067;
uniform float Port_RangeMinB_N067;
uniform float Port_Input1_N078;
uniform float randScale;
uniform float Port_Input0_N129;
uniform float Port_Import_N071;
uniform float Port_Input1_N072;
uniform float Port_Input2_N072;
uniform float Port_Import_N106;
uniform vec2 Port_Scale_N041;
uniform float Port_Input1_N122;
uniform float Port_Input1_N125;
uniform float Port_Input1_N126;
uniform float Port_Input2_N126;
uniform vec4 sc_Time;
uniform mat4 sc_ModelMatrixInverse;
out float varClipDistance;
flat out int varStereoViewID;
in vec4 boneData;
in vec3 blendShape0Pos;
in vec3 blendShape0Normal;
in vec3 blendShape1Pos;
in vec3 blendShape1Normal;
in vec3 blendShape2Pos;
in vec3 blendShape2Normal;
in vec3 blendShape3Pos;
in vec3 blendShape4Pos;
in vec3 blendShape5Pos;
in vec4 position;
in vec3 normal;
in vec4 tangent;
in vec2 texture0;
in vec2 texture1;
out vec3 varPos;
out vec3 varNormal;
out vec4 varTangent;
out vec4 varPackedTex;
out vec4 varScreenPos;
out vec2 varScreenTexturePos;
out vec2 varShadowTex;
out float varViewSpaceDepth;
out vec4 varColor;
in vec4 color;
out vec4 PreviewVertexColor;
out float PreviewVertexSaved;
in vec3 positionNext;
in vec3 positionPrevious;
in vec4 strandProperties;
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
void Node105_If_else(float Bool1,float Value1,float Default,out float Result,ssGlobals Globals)
{
#if (Tweak_N87)
{
Value1=(Globals.gTimeElapsed*((((glitchSpeed-Port_RangeMinA_N002)/((Port_RangeMaxA_N002-Port_RangeMinA_N002)+1e-06))*(Port_RangeMaxB_N002-Port_RangeMinB_N002))+Port_RangeMinB_N002))+((((glitchOffset-Port_RangeMinA_N103)/((Port_RangeMaxA_N103-Port_RangeMinA_N103)+1e-06))*(Port_RangeMaxB_N103-Port_RangeMinB_N103))+Port_RangeMinB_N103);
Result=Value1;
}
#else
{
Default=(((glitchOffset-Port_RangeMinA_N103)/((Port_RangeMaxA_N103-Port_RangeMinA_N103)+1e-06))*(Port_RangeMaxB_N103-Port_RangeMinB_N103))+Port_RangeMinB_N103;
Result=Default;
}
#endif
}
float snoise(vec2 v)
{
#if (SC_DEVICE_CLASS>=2)
{
vec2 l9_0=floor(v+vec2(dot(v,vec2(0.36602542))));
vec2 l9_1=(v-l9_0)+vec2(dot(l9_0,vec2(0.21132487)));
float l9_2=l9_1.x;
float l9_3=l9_1.y;
bvec2 l9_4=bvec2(l9_2>l9_3);
vec2 l9_5=vec2(l9_4.x ? vec2(1.0,0.0).x : vec2(0.0,1.0).x,l9_4.y ? vec2(1.0,0.0).y : vec2(0.0,1.0).y);
vec2 l9_6=(l9_1+vec2(0.21132487))-l9_5;
vec2 l9_7=l9_1+vec2(-0.57735026);
vec2 l9_8=l9_0-(floor(l9_0*0.0034602077)*289.0);
vec3 l9_9=vec3(l9_8.y)+vec3(0.0,l9_5.y,1.0);
vec3 l9_10=((l9_9*34.0)+vec3(1.0))*l9_9;
vec3 l9_11=((l9_10-(floor(l9_10*0.0034602077)*289.0))+vec3(l9_8.x))+vec3(0.0,l9_5.x,1.0);
vec3 l9_12=((l9_11*34.0)+vec3(1.0))*l9_11;
vec3 l9_13=max(vec3(0.5)-vec3(dot(l9_1,l9_1),dot(l9_6,l9_6),dot(l9_7,l9_7)),vec3(0.0));
vec3 l9_14=l9_13*l9_13;
vec3 l9_15=(fract((l9_12-(floor(l9_12*0.0034602077)*289.0))*vec3(0.024390243))*2.0)-vec3(1.0);
vec3 l9_16=abs(l9_15)-vec3(0.5);
vec3 l9_17=l9_15-floor(l9_15+vec3(0.5));
vec3 l9_18=vec3(0.0);
l9_18.x=(l9_17.x*l9_2)+(l9_16.x*l9_3);
vec2 l9_19=(l9_17.yz*vec2(l9_6.x,l9_7.x))+(l9_16.yz*vec2(l9_6.y,l9_7.y));
return 130.0*dot((l9_14*l9_14)*(vec3(1.7928429)-(((l9_17*l9_17)+(l9_16*l9_16))*0.85373473)),vec3(l9_18.x,l9_19.x,l9_19.y));
}
#else
{
return 0.0;
}
#endif
}
void Node164_Noise_Simplex(vec2 Seed,vec2 Scale,out float Noise,ssGlobals Globals)
{
Seed.x=floor(Seed.x*10000.0)*9.9999997e-05;
Seed.y=floor(Seed.y*10000.0)*9.9999997e-05;
Seed*=(Scale*0.5);
Noise=(snoise(Seed)*0.5)+0.5;
Noise=floor(Noise*10000.0)*9.9999997e-05;
}
void Node183_Loop_Triplanar_UV(float Input,vec3 Position,vec3 Normal,vec3 Scale,vec3 Offset_1,float Sharpness,out float Output,ssGlobals Globals)
{
Scale=vec3(clamp(glitchScale,0.0,1.0));
float param_3;
Node105_If_else(0.0,0.0,0.0,param_3,Globals);
Offset_1=vec3(Port_Input0_N009*param_3);
Sharpness=clamp(Port_Import_N181+0.001,Port_Input1_N182+0.001,Port_Input2_N182+0.001)-0.001;
Position=(Globals.SurfacePosition_ObjectSpace/(vec3(length(sc_LocalAabbMax-sc_LocalAabbMin))+vec3(1.234e-06)))*vec3(max(Port_Import_N174,0.0));
Normal=Globals.VertexNormal_ObjectSpace;
vec3 p=(Position+Offset_1)*Scale;
vec3 n=abs(Normal);
float l9_0=n.x;
float l9_1=n.y;
bool l9_2=l9_0>l9_1;
bool l9_3;
if (l9_2)
{
l9_3=n.x>n.z;
}
else
{
l9_3=l9_2;
}
ivec3 l9_4;
if (l9_3)
{
l9_4=ivec3(0,1,2);
}
else
{
bvec3 l9_5=bvec3(n.y>n.z);
l9_4=ivec3(l9_5.x ? ivec3(1,2,0).x : ivec3(2,0,1).x,l9_5.y ? ivec3(1,2,0).y : ivec3(2,0,1).y,l9_5.z ? ivec3(1,2,0).z : ivec3(2,0,1).z);
}
float l9_6=n.x;
float l9_7=n.y;
bool l9_8=l9_6<l9_7;
bool l9_9;
if (l9_8)
{
l9_9=n.x<n.z;
}
else
{
l9_9=l9_8;
}
ivec3 l9_10;
if (l9_9)
{
l9_10=ivec3(0,1,2);
}
else
{
bvec3 l9_11=bvec3(n.y<n.z);
l9_10=ivec3(l9_11.x ? ivec3(1,2,0).x : ivec3(2,0,1).x,l9_11.y ? ivec3(1,2,0).y : ivec3(2,0,1).y,l9_11.z ? ivec3(1,2,0).z : ivec3(2,0,1).z);
}
ivec3 l9_12=(ivec3(3)-l9_10)-l9_4;
Globals.gTriplanarCoords=vec2(p[l9_4.y],p[l9_4.z]);
float param_7;
Node164_Noise_Simplex(Globals.gTriplanarCoords,Port_Scale_N164,param_7,Globals);
Input=param_7;
float l9_13=Input;
Globals.gTriplanarCoords=vec2(p[l9_12.y],p[l9_12.z]);
float param_11;
Node164_Noise_Simplex(Globals.gTriplanarCoords,Port_Scale_N164,param_11,Globals);
Input=param_11;
vec2 l9_14=pow(vec2(n[l9_4.x],n[l9_12.x]),vec2(1.0/(1.0-(Sharpness*0.99000001))));
float l9_15=l9_14.x;
float l9_16=l9_14.y;
Output=((l9_13*l9_15)+(Input*l9_16))/(l9_15+l9_16);
}
void Node121_Conditional(float Input0,vec3 Input1,vec3 Input2,out vec3 Output,ssGlobals Globals)
{
float param_3;
Node105_If_else(0.0,0.0,0.0,param_3,Globals);
float l9_0=((((glitchFrequency-Port_RangeMinA_N034)/((Port_RangeMaxA_N034-Port_RangeMinA_N034)+1e-06))*(Port_RangeMaxB_N034-Port_RangeMinB_N034))+Port_RangeMinB_N034)*param_3;
Input0=float(fract(l9_0)<Port_Input1_N055)+float(fract(l9_0*Port_Input1_N056)<Port_Input1_N066);
if ((Input0*1.0)!=0.0)
{
float param_8;
Node105_If_else(0.0,0.0,0.0,param_8,Globals);
float l9_1=param_8;
vec3 l9_2=Globals.SurfacePosition_ObjectSpace;
float l9_3=(min(glitchIntensity,30.0)*length(sc_LocalAabbMax-sc_LocalAabbMin))*Port_Import_N203;
float param_16;
Node183_Loop_Triplanar_UV(0.0,vec3(0.0),vec3(0.0,1.0,0.0),vec3(1.0),vec3(0.0),1.0,param_16,Globals);
float l9_4=param_16;
float l9_5=l9_4*Port_Input1_N140;
float l9_6;
if (l9_5<=0.0)
{
l9_6=0.0;
}
else
{
l9_6=pow(l9_5,Port_Input1_N141);
}
vec3 l9_7=l9_2-(vec3((l9_3*l9_6)*Port_Input2_N110)*Globals.VertexNormal_ObjectSpace);
Input1=vec4((sin(l9_1*l9_2.y)*(l9_3/(Port_Input1_N117+1.234e-06)))+l9_7.x,l9_2.y,l9_7.z,0.0).xyz;
Output=Input1;
}
else
{
Input2=Globals.SurfacePosition_ObjectSpace;
Output=Input2;
}
}
void Node64_Conditional(float Input0,float Input1,float Input2,out float Output,ssGlobals Globals)
{
#if (Tweak_N68)
{
Input1=1.0-((((scanlineSpeed-Port_RangeMinA_N063)/((Port_RangeMaxA_N063-Port_RangeMinA_N063)+1e-06))*(Port_RangeMaxB_N063-Port_RangeMinB_N063))+Port_RangeMinB_N063);
Output=Input1;
}
#else
{
Input2=(((scanlineSpeed-Port_RangeMinA_N063)/((Port_RangeMaxA_N063-Port_RangeMinA_N063)+1e-06))*(Port_RangeMaxB_N063-Port_RangeMinB_N063))+Port_RangeMinB_N063;
Output=Input2;
}
#endif
}
void Node10_If_else(float Bool1,float Value1,float Default,out float Result,ssGlobals Globals)
{
#if (animated)
{
float param_3;
Node64_Conditional(1.0,1.0,0.0,param_3,Globals);
Value1=(Globals.gTimeElapsed*param_3)+((((Offset-Port_RangeMinA_N067)/((Port_RangeMaxA_N067-Port_RangeMinA_N067)+1e-06))*(Port_RangeMaxB_N067-Port_RangeMinB_N067))+Port_RangeMinB_N067);
Result=Value1;
}
#else
{
Default=(((Offset-Port_RangeMinA_N067)/((Port_RangeMaxA_N067-Port_RangeMinA_N067)+1e-06))*(Port_RangeMaxB_N067-Port_RangeMinB_N067))+Port_RangeMinB_N067;
Result=Default;
}
#endif
}
void Node86_Conditional(float Input0,vec2 Input1,vec2 Input2,out vec2 Output,ssGlobals Globals)
{
#if (Tweak_N89)
{
Input1=Globals.gScreenCoord/(vec2(Port_Input1_N078)+vec2(1.234e-06));
Output=Input1;
}
#else
{
Input2=Globals.SurfacePosition_ObjectSpace.xy;
Output=Input2;
}
#endif
}
void Node41_Noise_Simplex(vec2 Seed,vec2 Scale,out float Noise,ssGlobals Globals)
{
Seed.x=floor(Seed.x*10000.0)*9.9999997e-05;
Seed.y=floor(Seed.y*10000.0)*9.9999997e-05;
Seed*=(Scale*0.5);
Noise=(snoise(Seed)*0.5)+0.5;
Noise=floor(Noise*10000.0)*9.9999997e-05;
}
void Node77_Loop_Triplanar_UV(float Input,vec3 Position,vec3 Normal,vec3 Scale,vec3 Offset_1,float Sharpness,out float Output,ssGlobals Globals)
{
Scale=vec3(Port_Input0_N129-randScale);
float param_3;
Node105_If_else(0.0,0.0,0.0,param_3,Globals);
Offset_1=vec3(param_3);
Sharpness=clamp(Port_Import_N071+0.001,Port_Input1_N072+0.001,Port_Input2_N072+0.001)-0.001;
Position=(Globals.SurfacePosition_ObjectSpace/(vec3(length(sc_LocalAabbMax-sc_LocalAabbMin))+vec3(1.234e-06)))*vec3(max(Port_Import_N106,0.0));
Normal=Globals.VertexNormal_ObjectSpace;
vec3 p=(Position+Offset_1)*Scale;
vec3 n=abs(Normal);
float l9_0=n.x;
float l9_1=n.y;
bool l9_2=l9_0>l9_1;
bool l9_3;
if (l9_2)
{
l9_3=n.x>n.z;
}
else
{
l9_3=l9_2;
}
ivec3 l9_4;
if (l9_3)
{
l9_4=ivec3(0,1,2);
}
else
{
bvec3 l9_5=bvec3(n.y>n.z);
l9_4=ivec3(l9_5.x ? ivec3(1,2,0).x : ivec3(2,0,1).x,l9_5.y ? ivec3(1,2,0).y : ivec3(2,0,1).y,l9_5.z ? ivec3(1,2,0).z : ivec3(2,0,1).z);
}
float l9_6=n.x;
float l9_7=n.y;
bool l9_8=l9_6<l9_7;
bool l9_9;
if (l9_8)
{
l9_9=n.x<n.z;
}
else
{
l9_9=l9_8;
}
ivec3 l9_10;
if (l9_9)
{
l9_10=ivec3(0,1,2);
}
else
{
bvec3 l9_11=bvec3(n.y<n.z);
l9_10=ivec3(l9_11.x ? ivec3(1,2,0).x : ivec3(2,0,1).x,l9_11.y ? ivec3(1,2,0).y : ivec3(2,0,1).y,l9_11.z ? ivec3(1,2,0).z : ivec3(2,0,1).z);
}
ivec3 l9_12=(ivec3(3)-l9_10)-l9_4;
Globals.gTriplanarCoords=vec2(p[l9_4.y],p[l9_4.z]);
float param_7;
Node41_Noise_Simplex(Globals.gTriplanarCoords,Port_Scale_N041,param_7,Globals);
Input=param_7;
float l9_13=Input;
Globals.gTriplanarCoords=vec2(p[l9_12.y],p[l9_12.z]);
float param_11;
Node41_Noise_Simplex(Globals.gTriplanarCoords,Port_Scale_N041,param_11,Globals);
Input=param_11;
vec2 l9_14=pow(vec2(n[l9_4.x],n[l9_12.x]),vec2(1.0/(1.0-(Sharpness*0.99000001))));
float l9_15=l9_14.x;
float l9_16=l9_14.y;
Output=((l9_13*l9_15)+(Input*l9_16))/(l9_15+l9_16);
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
varStereoViewID=sc_StereoViewID;
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
vec3 l9_5=varNormal;
vec3 l9_6=varPos;
vec4 l9_7=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
vec3 l9_8=varNormal;
ssGlobals l9_9=ssGlobals(sc_Time.x,sc_Time.y,0.0,(sc_ModelMatrixInverse*vec4(varPos,1.0)).xyz,l9_5,normalize((sc_ModelMatrixInverse*vec4(l9_5,0.0)).xyz),vec2(0.0),l9_6,((l9_7.xyz/vec3(l9_7.w)).xy*0.5)+vec2(0.5));
vec3 l9_10;
#if (Tweak_N75&&Tweak_N76)
{
vec3 l9_11;
Node121_Conditional(0.0,vec3(1.0),vec3(0.0),l9_11,l9_9);
float l9_12;
#if (Tweak_N130)
{
float l9_13;
Node10_If_else(0.0,0.0,0.0,l9_13,l9_9);
float l9_14=l9_13;
vec2 l9_15;
Node86_Conditional(1.0,vec2(1.0),vec2(0.0),l9_15,l9_9);
float l9_16;
Node77_Loop_Triplanar_UV(0.0,vec3(0.0),vec3(0.0,1.0,0.0),vec3(1.0),vec3(0.0),1.0,l9_16,l9_9);
float l9_17=l9_16;
float l9_18=l9_17*Port_Input1_N122;
float l9_19;
if (l9_18<=0.0)
{
l9_19=0.0;
}
else
{
l9_19=pow(l9_18,Port_Input1_N125);
}
l9_12=clamp((float(fract(thickLines*(l9_14-l9_15.y))<(1.0-(Port_Input0_N129-randScale)))*l9_19)+0.001,Port_Input1_N126+0.001,Port_Input2_N126+0.001)-0.001;
}
#else
{
float l9_20;
Node10_If_else(0.0,0.0,0.0,l9_20,l9_9);
float l9_21=l9_20;
vec2 l9_22;
Node86_Conditional(1.0,vec2(1.0),vec2(0.0),l9_22,l9_9);
float l9_23;
Node77_Loop_Triplanar_UV(0.0,vec3(0.0),vec3(0.0,1.0,0.0),vec3(1.0),vec3(0.0),1.0,l9_23,l9_9);
float l9_24=l9_23;
float l9_25=l9_24*Port_Input1_N122;
float l9_26;
if (l9_25<=0.0)
{
l9_26=0.0;
}
else
{
l9_26=pow(l9_25,Port_Input1_N125);
}
l9_12=1.0-(clamp((float(fract(thickLines*(l9_21-l9_22.y))<(1.0-(Port_Input0_N129-randScale)))*l9_26)+0.001,Port_Input1_N126+0.001,Port_Input2_N126+0.001)-0.001);
}
#endif
l9_10=mix((sc_ModelMatrix*vec4(l9_11,1.0)).xyz,l9_6,vec3(l9_12));
}
#else
{
vec3 l9_27;
#if (Tweak_N76)
{
vec3 l9_28;
Node121_Conditional(0.0,vec3(1.0),vec3(0.0),l9_28,l9_9);
l9_27=(sc_ModelMatrix*vec4(l9_28,1.0)).xyz;
}
#else
{
l9_27=l9_6;
}
#endif
l9_10=l9_27;
}
#endif
vec3 l9_29;
vec3 l9_30;
vec3 l9_31;
if (l9_2)
{
l9_31=varTangent.xyz;
l9_30=varNormal;
l9_29=varPos;
}
else
{
l9_31=varTangent.xyz;
l9_30=l9_8;
l9_29=l9_10;
}
varPos=l9_29;
varNormal=normalize(l9_30);
vec3 l9_32=normalize(l9_31);
varTangent=vec4(l9_32.x,l9_32.y,l9_32.z,varTangent.w);
varTangent.w=tangent.w;
#if (UseViewSpaceDepthVariant&&((sc_OITDepthGatherPass||sc_OITCompositingPass)||sc_OITDepthBoundsPass))
{
vec4 l9_33;
#if (sc_RenderingSpace==3)
{
l9_33=sc_ProjectionMatrixInverseArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
vec4 l9_34;
#if (sc_RenderingSpace==2)
{
l9_34=sc_ViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
vec4 l9_35;
#if (sc_RenderingSpace==1)
{
l9_35=sc_ModelViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position;
}
#else
{
l9_35=l9_0.position;
}
#endif
l9_34=l9_35;
}
#endif
l9_33=l9_34;
}
#endif
varViewSpaceDepth=-l9_33.z;
}
#endif
vec4 l9_36;
#if (sc_RenderingSpace==3)
{
l9_36=l9_0.position;
}
#else
{
vec4 l9_37;
#if (sc_RenderingSpace==4)
{
l9_37=(sc_ModelViewMatrixArray[sc_GetStereoViewIndex()]*l9_0.position)*vec4(1.0/sc_Camera.aspect,1.0,1.0,1.0);
}
#else
{
vec4 l9_38;
#if (sc_RenderingSpace==2)
{
l9_38=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
}
#else
{
vec4 l9_39;
#if (sc_RenderingSpace==1)
{
l9_39=sc_ViewProjectionMatrixArray[sc_GetStereoViewIndex()]*vec4(varPos,1.0);
}
#else
{
l9_39=vec4(0.0);
}
#endif
l9_38=l9_39;
}
#endif
l9_37=l9_38;
}
#endif
l9_36=l9_37;
}
#endif
varPackedTex=vec4(l9_3,l9_0.texture1);
#if (sc_ProjectiveShadowsReceiver)
{
vec4 l9_40;
#if (sc_RenderingSpace==1)
{
l9_40=sc_ModelMatrix*l9_0.position;
}
#else
{
l9_40=l9_0.position;
}
#endif
vec4 l9_41=sc_ProjectorMatrix*l9_40;
varShadowTex=((l9_41.xy/vec2(l9_41.w))*0.5)+vec2(0.5);
}
#endif
vec4 l9_42;
#if (sc_DepthBufferMode==1)
{
vec4 l9_43;
if (sc_ProjectionMatrixArray[sc_GetStereoViewIndex()][2].w!=0.0)
{
vec4 l9_44=l9_36;
l9_44.z=((log2(max(sc_Camera.clipPlanes.x,1.0+l9_36.w))*(2.0/log2(sc_Camera.clipPlanes.y+1.0)))-1.0)*l9_36.w;
l9_43=l9_44;
}
else
{
l9_43=l9_36;
}
l9_42=l9_43;
}
#else
{
l9_42=l9_36;
}
#endif
vec4 l9_45;
#if (sc_TAAEnabled)
{
vec2 l9_46=l9_42.xy+(sc_TAAJitterOffset*l9_42.w);
l9_45=vec4(l9_46.x,l9_46.y,l9_42.z,l9_42.w);
}
#else
{
l9_45=l9_42;
}
#endif
sc_SetClipPosition(l9_45);
#if (sc_Voxelization)
{
sc_Vertex_t l9_47=sc_Vertex_t(l9_0.position,l9_0.normal,l9_0.tangent,l9_3,l9_0.texture1);
sc_BlendVertex(l9_47);
sc_SkinVertex(l9_47);
int l9_48=sc_GetLocalInstanceIDInternal(sc_FallbackInstanceID);
int l9_49=int(voxelization_params_0.w);
vec4 l9_50=createVoxelOrthoMatrix(voxelization_params_frustum_lrbt.x,voxelization_params_frustum_lrbt.y,voxelization_params_frustum_lrbt.z,voxelization_params_frustum_lrbt.w,voxelization_params_frustum_nf.x,voxelization_params_frustum_nf.y)*vec4(((sc_ModelMatrixVoxelization*l9_47.position).xyz+vec3(float(l9_48%l9_49)*voxelization_params_0.y,float(l9_48/l9_49)*voxelization_params_0.y,(float(l9_48)*(voxelization_params_0.y/voxelization_params_0.z))+voxelization_params_frustum_nf.x))-voxelization_params_camera_pos,1.0);
l9_50.w=1.0;
varScreenPos=l9_50;
sc_SetClipPosition(l9_50*1.0);
}
#else
{
#if (sc_OutputBounds)
{
sc_Vertex_t l9_51=sc_Vertex_t(l9_0.position,l9_0.normal,l9_0.tangent,l9_3,l9_0.texture1);
sc_BlendVertex(l9_51);
sc_SkinVertex(l9_51);
vec2 l9_52=((l9_51.position.xy/vec2(l9_51.position.w))*0.5)+vec2(0.5);
varPackedTex=vec4(l9_52.x,l9_52.y,varPackedTex.z,varPackedTex.w);
vec4 l9_53=sc_ModelMatrixVoxelization*l9_51.position;
vec3 l9_54=l9_53.xyz-voxelization_params_camera_pos;
varPos=l9_54.xyz;
varNormal=normalize(l9_51.normal);
vec4 l9_55=createVoxelOrthoMatrix(voxelization_params_frustum_lrbt.x,voxelization_params_frustum_lrbt.y,voxelization_params_frustum_lrbt.z,voxelization_params_frustum_lrbt.w,voxelization_params_frustum_nf.x,voxelization_params_frustum_nf.y)*vec4(l9_54.x,l9_54.y,l9_54.z,l9_53.w);
vec4 l9_56=vec4(l9_55.x,l9_55.y,l9_55.z,vec4(0.0).w);
l9_56.w=1.0;
varScreenPos=l9_56;
sc_SetClipPosition(l9_56*1.0);
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
#ifndef sc_StereoRenderingMode
#define sc_StereoRenderingMode 0
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
#ifndef opacityTextureHasSwappedViews
#define opacityTextureHasSwappedViews 0
#elif opacityTextureHasSwappedViews==1
#undef opacityTextureHasSwappedViews
#define opacityTextureHasSwappedViews 1
#endif
#ifndef opacityTextureLayout
#define opacityTextureLayout 0
#endif
#ifndef animated
#define animated 0
#elif animated==1
#undef animated
#define animated 1
#endif
#ifndef Tweak_N68
#define Tweak_N68 0
#elif Tweak_N68==1
#undef Tweak_N68
#define Tweak_N68 1
#endif
#ifndef Tweak_N89
#define Tweak_N89 0
#elif Tweak_N89==1
#undef Tweak_N89
#define Tweak_N89 1
#endif
#ifndef Tweak_N12
#define Tweak_N12 0
#elif Tweak_N12==1
#undef Tweak_N12
#define Tweak_N12 1
#endif
#ifndef SC_USE_UV_TRANSFORM_opacityTexture
#define SC_USE_UV_TRANSFORM_opacityTexture 0
#elif SC_USE_UV_TRANSFORM_opacityTexture==1
#undef SC_USE_UV_TRANSFORM_opacityTexture
#define SC_USE_UV_TRANSFORM_opacityTexture 1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_U_opacityTexture
#define SC_SOFTWARE_WRAP_MODE_U_opacityTexture -1
#endif
#ifndef SC_SOFTWARE_WRAP_MODE_V_opacityTexture
#define SC_SOFTWARE_WRAP_MODE_V_opacityTexture -1
#endif
#ifndef SC_USE_UV_MIN_MAX_opacityTexture
#define SC_USE_UV_MIN_MAX_opacityTexture 0
#elif SC_USE_UV_MIN_MAX_opacityTexture==1
#undef SC_USE_UV_MIN_MAX_opacityTexture
#define SC_USE_UV_MIN_MAX_opacityTexture 1
#endif
#ifndef SC_USE_CLAMP_TO_BORDER_opacityTexture
#define SC_USE_CLAMP_TO_BORDER_opacityTexture 0
#elif SC_USE_CLAMP_TO_BORDER_opacityTexture==1
#undef SC_USE_CLAMP_TO_BORDER_opacityTexture
#define SC_USE_CLAMP_TO_BORDER_opacityTexture 1
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
uniform vec4 thicklinesColor;
uniform float thickLines;
uniform float scanlineSpeed;
uniform float Port_RangeMinA_N063;
uniform float Port_RangeMaxA_N063;
uniform float Port_RangeMaxB_N063;
uniform float Port_RangeMinB_N063;
uniform float Offset;
uniform float Port_RangeMinA_N067;
uniform float Port_RangeMaxA_N067;
uniform float Port_RangeMaxB_N067;
uniform float Port_RangeMinB_N067;
uniform float Port_Input1_N078;
uniform float thinLines;
uniform vec4 thinlinesColor;
uniform vec4 rimTint;
uniform mat3 opacityTextureTransform;
uniform vec4 opacityTextureUvMinMax;
uniform vec4 opacityTextureBorderColor;
uniform vec4 sc_Time;
uniform sc_Camera_t sc_Camera;
uniform float Port_Input1_N020;
uniform float Port_Input1_N049;
uniform float Port_Input2_N014;
uniform float Port_Input1_N058;
uniform float Port_Input2_N058;
uniform int PreviewEnabled;
uniform sampler2D opacityTexture;
uniform sampler2DArray opacityTextureArrSC;
uniform sampler2D sc_ScreenTexture;
uniform sampler2DArray sc_ScreenTextureArrSC;
uniform sampler2D intensityTexture;
uniform sampler2DArray intensityTextureArrSC;
uniform sampler2D sc_OITFrontDepthTexture;
uniform sampler2D sc_OITDepthHigh0;
uniform sampler2D sc_OITDepthLow0;
uniform sampler2D sc_OITAlpha0;
uniform sampler2D sc_OITDepthHigh1;
uniform sampler2D sc_OITDepthLow1;
uniform sampler2D sc_OITAlpha1;
uniform sampler2D sc_OITFilteredDepthBoundsTexture;
flat in int varStereoViewID;
in vec2 varShadowTex;
in float varClipDistance;
in vec4 varScreenPos;
in float varViewSpaceDepth;
in vec4 PreviewVertexColor;
in float PreviewVertexSaved;
in vec3 varPos;
in vec3 varNormal;
in vec4 varPackedTex;
in vec4 varTangent;
in vec2 varScreenTexturePos;
in vec4 varColor;
int sc_GetStereoViewIndex()
{
int l9_0;
#if (sc_StereoRenderingMode==0)
{
l9_0=0;
}
#else
{
l9_0=varStereoViewID;
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
int opacityTextureGetStereoViewIndex()
{
int l9_0;
#if (opacityTextureHasSwappedViews)
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
int intensityTextureGetStereoViewIndex()
{
int l9_0;
#if (intensityTextureHasSwappedViews)
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
float l9_48=pow(l9_47,1.0/correctedIntensity);
vec4 l9_49;
#if (intensityTextureLayout==2)
{
bool l9_50=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0)&&(!(int(SC_USE_UV_MIN_MAX_intensityTexture)!=0));
float l9_51=l9_48;
sc_SoftwareWrapEarly(l9_51,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x);
float l9_52=l9_51;
float l9_53=0.5;
sc_SoftwareWrapEarly(l9_53,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y);
float l9_54=l9_53;
vec2 l9_55;
float l9_56;
#if (SC_USE_UV_MIN_MAX_intensityTexture)
{
bool l9_57;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_57=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x==3;
}
#else
{
l9_57=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_58=l9_52;
float l9_59=1.0;
sc_ClampUV(l9_58,intensityTextureUvMinMax.x,intensityTextureUvMinMax.z,l9_57,l9_59);
float l9_60=l9_58;
float l9_61=l9_59;
bool l9_62;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_62=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y==3;
}
#else
{
l9_62=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_63=l9_54;
float l9_64=l9_61;
sc_ClampUV(l9_63,intensityTextureUvMinMax.y,intensityTextureUvMinMax.w,l9_62,l9_64);
l9_56=l9_64;
l9_55=vec2(l9_60,l9_63);
}
#else
{
l9_56=1.0;
l9_55=vec2(l9_52,l9_54);
}
#endif
vec2 l9_65=sc_TransformUV(l9_55,(int(SC_USE_UV_TRANSFORM_intensityTexture)!=0),intensityTextureTransform);
float l9_66=l9_65.x;
float l9_67=l9_56;
sc_SoftwareWrapLate(l9_66,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x,l9_50,l9_67);
float l9_68=l9_65.y;
float l9_69=l9_67;
sc_SoftwareWrapLate(l9_68,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y,l9_50,l9_69);
float l9_70=l9_69;
vec3 l9_71=sc_SamplingCoordsViewToGlobal(vec2(l9_66,l9_68),intensityTextureLayout,intensityTextureGetStereoViewIndex());
vec4 l9_72=texture(intensityTextureArrSC,l9_71,0.0);
vec4 l9_73;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_73=mix(intensityTextureBorderColor,l9_72,vec4(l9_70));
}
#else
{
l9_73=l9_72;
}
#endif
l9_49=l9_73;
}
#else
{
bool l9_74=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0)&&(!(int(SC_USE_UV_MIN_MAX_intensityTexture)!=0));
float l9_75=l9_48;
sc_SoftwareWrapEarly(l9_75,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x);
float l9_76=l9_75;
float l9_77=0.5;
sc_SoftwareWrapEarly(l9_77,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y);
float l9_78=l9_77;
vec2 l9_79;
float l9_80;
#if (SC_USE_UV_MIN_MAX_intensityTexture)
{
bool l9_81;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_81=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x==3;
}
#else
{
l9_81=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_82=l9_76;
float l9_83=1.0;
sc_ClampUV(l9_82,intensityTextureUvMinMax.x,intensityTextureUvMinMax.z,l9_81,l9_83);
float l9_84=l9_82;
float l9_85=l9_83;
bool l9_86;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_86=ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y==3;
}
#else
{
l9_86=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture)!=0);
}
#endif
float l9_87=l9_78;
float l9_88=l9_85;
sc_ClampUV(l9_87,intensityTextureUvMinMax.y,intensityTextureUvMinMax.w,l9_86,l9_88);
l9_80=l9_88;
l9_79=vec2(l9_84,l9_87);
}
#else
{
l9_80=1.0;
l9_79=vec2(l9_76,l9_78);
}
#endif
vec2 l9_89=sc_TransformUV(l9_79,(int(SC_USE_UV_TRANSFORM_intensityTexture)!=0),intensityTextureTransform);
float l9_90=l9_89.x;
float l9_91=l9_80;
sc_SoftwareWrapLate(l9_90,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).x,l9_74,l9_91);
float l9_92=l9_89.y;
float l9_93=l9_91;
sc_SoftwareWrapLate(l9_92,ivec2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture,SC_SOFTWARE_WRAP_MODE_V_intensityTexture).y,l9_74,l9_93);
float l9_94=l9_93;
vec3 l9_95=sc_SamplingCoordsViewToGlobal(vec2(l9_90,l9_92),intensityTextureLayout,intensityTextureGetStereoViewIndex());
vec4 l9_96=texture(intensityTexture,l9_95.xy,0.0);
vec4 l9_97;
#if (SC_USE_CLAMP_TO_BORDER_intensityTexture)
{
l9_97=mix(intensityTextureBorderColor,l9_96,vec4(l9_94));
}
#else
{
l9_97=l9_96;
}
#endif
l9_49=l9_97;
}
#endif
float l9_98=((((l9_49.x*256.0)+l9_49.y)+(l9_49.z/256.0))/257.00391)*16.0;
float l9_99;
#if (BLEND_MODE_FORGRAY)
{
l9_99=max(l9_98,1.0);
}
#else
{
l9_99=l9_98;
}
#endif
float l9_100;
#if (BLEND_MODE_NOTBRIGHT)
{
l9_100=min(l9_99,1.0);
}
#else
{
l9_100=l9_99;
}
#endif
return transformColor(l9_47,l9_45,l9_46,1.0,l9_100);
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
float l9_2;
#if (animated)
{
float l9_3;
#if (Tweak_N68)
{
l9_3=1.0-((((scanlineSpeed-Port_RangeMinA_N063)/((Port_RangeMaxA_N063-Port_RangeMinA_N063)+1e-06))*(Port_RangeMaxB_N063-Port_RangeMinB_N063))+Port_RangeMinB_N063);
}
#else
{
l9_3=(((scanlineSpeed-Port_RangeMinA_N063)/((Port_RangeMaxA_N063-Port_RangeMinA_N063)+1e-06))*(Port_RangeMaxB_N063-Port_RangeMinB_N063))+Port_RangeMinB_N063;
}
#endif
l9_2=(sc_Time.x*l9_3)+((((Offset-Port_RangeMinA_N067)/((Port_RangeMaxA_N067-Port_RangeMinA_N067)+1e-06))*(Port_RangeMaxB_N067-Port_RangeMinB_N067))+Port_RangeMinB_N067);
}
#else
{
l9_2=(((Offset-Port_RangeMinA_N067)/((Port_RangeMaxA_N067-Port_RangeMinA_N067)+1e-06))*(Port_RangeMaxB_N067-Port_RangeMinB_N067))+Port_RangeMinB_N067;
}
#endif
vec2 l9_4;
#if (Tweak_N89)
{
l9_4=l9_1/(vec2(Port_Input1_N078)+vec2(1.234e-06));
}
#else
{
l9_4=(sc_ModelMatrixInverse*vec4(varPos,1.0)).xy;
}
#endif
float l9_5=l9_2-l9_4.y;
vec4 l9_6=(((thicklinesColor*vec4(Port_Input1_N020))*vec4(fract(thickLines*l9_5)))+((vec4(fract(l9_4.y*thinLines))*vec4(Port_Input1_N049))*thinlinesColor))+(vec4(1.0-clamp(dot(normalize(sc_Camera.position-varPos),normalize(varNormal)),0.0,1.0))*rimTint);
vec4 l9_7;
#if (Tweak_N12)
{
vec4 l9_8;
#if (opacityTextureLayout==2)
{
bool l9_9=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0)&&(!(int(SC_USE_UV_MIN_MAX_opacityTexture)!=0));
float l9_10=varPackedTex.x;
sc_SoftwareWrapEarly(l9_10,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x);
float l9_11=l9_10;
float l9_12=varPackedTex.y;
sc_SoftwareWrapEarly(l9_12,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y);
float l9_13=l9_12;
vec2 l9_14;
float l9_15;
#if (SC_USE_UV_MIN_MAX_opacityTexture)
{
bool l9_16;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_16=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x==3;
}
#else
{
l9_16=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0);
}
#endif
float l9_17=l9_11;
float l9_18=1.0;
sc_ClampUV(l9_17,opacityTextureUvMinMax.x,opacityTextureUvMinMax.z,l9_16,l9_18);
float l9_19=l9_17;
float l9_20=l9_18;
bool l9_21;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_21=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y==3;
}
#else
{
l9_21=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0);
}
#endif
float l9_22=l9_13;
float l9_23=l9_20;
sc_ClampUV(l9_22,opacityTextureUvMinMax.y,opacityTextureUvMinMax.w,l9_21,l9_23);
l9_15=l9_23;
l9_14=vec2(l9_19,l9_22);
}
#else
{
l9_15=1.0;
l9_14=vec2(l9_11,l9_13);
}
#endif
vec2 l9_24=sc_TransformUV(l9_14,(int(SC_USE_UV_TRANSFORM_opacityTexture)!=0),opacityTextureTransform);
float l9_25=l9_24.x;
float l9_26=l9_15;
sc_SoftwareWrapLate(l9_25,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x,l9_9,l9_26);
float l9_27=l9_24.y;
float l9_28=l9_26;
sc_SoftwareWrapLate(l9_27,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y,l9_9,l9_28);
float l9_29=l9_28;
vec3 l9_30=sc_SamplingCoordsViewToGlobal(vec2(l9_25,l9_27),opacityTextureLayout,opacityTextureGetStereoViewIndex());
vec4 l9_31=texture(opacityTextureArrSC,l9_30,0.0);
vec4 l9_32;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_32=mix(opacityTextureBorderColor,l9_31,vec4(l9_29));
}
#else
{
l9_32=l9_31;
}
#endif
l9_8=l9_32;
}
#else
{
bool l9_33=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0)&&(!(int(SC_USE_UV_MIN_MAX_opacityTexture)!=0));
float l9_34=varPackedTex.x;
sc_SoftwareWrapEarly(l9_34,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x);
float l9_35=l9_34;
float l9_36=varPackedTex.y;
sc_SoftwareWrapEarly(l9_36,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y);
float l9_37=l9_36;
vec2 l9_38;
float l9_39;
#if (SC_USE_UV_MIN_MAX_opacityTexture)
{
bool l9_40;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_40=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x==3;
}
#else
{
l9_40=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0);
}
#endif
float l9_41=l9_35;
float l9_42=1.0;
sc_ClampUV(l9_41,opacityTextureUvMinMax.x,opacityTextureUvMinMax.z,l9_40,l9_42);
float l9_43=l9_41;
float l9_44=l9_42;
bool l9_45;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_45=ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y==3;
}
#else
{
l9_45=(int(SC_USE_CLAMP_TO_BORDER_opacityTexture)!=0);
}
#endif
float l9_46=l9_37;
float l9_47=l9_44;
sc_ClampUV(l9_46,opacityTextureUvMinMax.y,opacityTextureUvMinMax.w,l9_45,l9_47);
l9_39=l9_47;
l9_38=vec2(l9_43,l9_46);
}
#else
{
l9_39=1.0;
l9_38=vec2(l9_35,l9_37);
}
#endif
vec2 l9_48=sc_TransformUV(l9_38,(int(SC_USE_UV_TRANSFORM_opacityTexture)!=0),opacityTextureTransform);
float l9_49=l9_48.x;
float l9_50=l9_39;
sc_SoftwareWrapLate(l9_49,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).x,l9_33,l9_50);
float l9_51=l9_48.y;
float l9_52=l9_50;
sc_SoftwareWrapLate(l9_51,ivec2(SC_SOFTWARE_WRAP_MODE_U_opacityTexture,SC_SOFTWARE_WRAP_MODE_V_opacityTexture).y,l9_33,l9_52);
float l9_53=l9_52;
vec3 l9_54=sc_SamplingCoordsViewToGlobal(vec2(l9_49,l9_51),opacityTextureLayout,opacityTextureGetStereoViewIndex());
vec4 l9_55=texture(opacityTexture,l9_54.xy,0.0);
vec4 l9_56;
#if (SC_USE_CLAMP_TO_BORDER_opacityTexture)
{
l9_56=mix(opacityTextureBorderColor,l9_55,vec4(l9_53));
}
#else
{
l9_56=l9_55;
}
#endif
l9_8=l9_56;
}
#endif
l9_7=l9_8;
}
#else
{
l9_7=vec4(Port_Input2_N014);
}
#endif
float l9_57=clamp((l9_6.w*l9_7.x)+0.001,Port_Input1_N058+0.001,Port_Input2_N058+0.001)-0.001;
vec4 l9_58=vec4(l9_6.x,l9_6.y,l9_6.z,vec4(0.0).w);
l9_58.w=l9_57;
#if (sc_BlendMode_AlphaTest)
{
if (l9_57<alphaTestThreshold)
{
discard;
}
}
#endif
#if (ENABLE_STIPPLE_PATTERN_TEST)
{
if (l9_57<((mod(dot(floor(mod(gl_FragCoord.xy,vec2(4.0))),vec2(4.0,1.0))*9.0,16.0)+1.0)/17.0))
{
discard;
}
}
#endif
vec4 l9_59;
#if (sc_ProjectiveShadowsCaster)
{
float l9_60;
#if (((sc_BlendMode_Normal||sc_BlendMode_AlphaToCoverage)||sc_BlendMode_PremultipliedAlphaHardware)||sc_BlendMode_PremultipliedAlphaAuto)
{
l9_60=l9_57;
}
#else
{
float l9_61;
#if (sc_BlendMode_PremultipliedAlpha)
{
l9_61=clamp(l9_57*2.0,0.0,1.0);
}
#else
{
float l9_62;
#if (sc_BlendMode_AddWithAlphaFactor)
{
l9_62=clamp(dot(l9_58.xyz,vec3(l9_57)),0.0,1.0);
}
#else
{
float l9_63;
#if (sc_BlendMode_AlphaTest)
{
l9_63=1.0;
}
#else
{
float l9_64;
#if (sc_BlendMode_Multiply)
{
l9_64=(1.0-dot(l9_58.xyz,vec3(0.33333001)))*l9_57;
}
#else
{
float l9_65;
#if (sc_BlendMode_MultiplyOriginal)
{
l9_65=(1.0-clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0))*l9_57;
}
#else
{
float l9_66;
#if (sc_BlendMode_ColoredGlass)
{
l9_66=clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0)*l9_57;
}
#else
{
float l9_67;
#if (sc_BlendMode_Add)
{
l9_67=clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
float l9_68;
#if (sc_BlendMode_AddWithAlphaFactor)
{
l9_68=clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0)*l9_57;
}
#else
{
float l9_69;
#if (sc_BlendMode_Screen)
{
l9_69=dot(l9_58.xyz,vec3(0.33333001))*l9_57;
}
#else
{
float l9_70;
#if (sc_BlendMode_Min)
{
l9_70=1.0-clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
float l9_71;
#if (sc_BlendMode_Max)
{
l9_71=clamp(dot(l9_58.xyz,vec3(1.0)),0.0,1.0);
}
#else
{
l9_71=1.0;
}
#endif
l9_70=l9_71;
}
#endif
l9_69=l9_70;
}
#endif
l9_68=l9_69;
}
#endif
l9_67=l9_68;
}
#endif
l9_66=l9_67;
}
#endif
l9_65=l9_66;
}
#endif
l9_64=l9_65;
}
#endif
l9_63=l9_64;
}
#endif
l9_62=l9_63;
}
#endif
l9_61=l9_62;
}
#endif
l9_60=l9_61;
}
#endif
l9_59=vec4(mix(sc_ShadowColor.xyz,sc_ShadowColor.xyz*l9_58.xyz,vec3(sc_ShadowColor.w)),sc_ShadowDensity*l9_60);
}
#else
{
vec4 l9_72;
#if (sc_RenderAlphaToColor)
{
l9_72=vec4(l9_57);
}
#else
{
vec4 l9_73;
#if (sc_BlendMode_Custom)
{
vec4 l9_74;
#if (sc_FramebufferFetch)
{
l9_74=sc_readFragData0_Platform();
}
#else
{
vec2 l9_75=sc_ScreenCoordsGlobalToView(l9_0);
vec4 l9_76;
#if (sc_ScreenTextureLayout==2)
{
l9_76=texture(sc_ScreenTextureArrSC,sc_SamplingCoordsViewToGlobal(l9_75,sc_ScreenTextureLayout,sc_ScreenTextureGetStereoViewIndex()),0.0);
}
#else
{
l9_76=texture(sc_ScreenTexture,sc_SamplingCoordsViewToGlobal(l9_75,sc_ScreenTextureLayout,sc_ScreenTextureGetStereoViewIndex()).xy,0.0);
}
#endif
l9_74=l9_76;
}
#endif
vec3 l9_77=mix(l9_74.xyz,definedBlend(l9_74.xyz,l9_58.xyz).xyz,vec3(l9_57));
vec4 l9_78=vec4(l9_77.x,l9_77.y,l9_77.z,vec4(0.0).w);
l9_78.w=1.0;
l9_73=l9_78;
}
#else
{
vec4 l9_79;
#if (sc_Voxelization)
{
l9_79=vec4(varScreenPos.xyz,1.0);
}
#else
{
vec4 l9_80;
#if (sc_OutputBounds)
{
float l9_81=clamp(abs(gl_FragCoord.z),0.0,1.0);
l9_80=vec4(l9_81,1.0-l9_81,1.0,1.0);
}
#else
{
vec4 l9_82;
#if (sc_BlendMode_MultiplyOriginal)
{
l9_82=vec4(mix(vec3(1.0),l9_58.xyz,vec3(l9_57)),l9_57);
}
#else
{
vec4 l9_83;
#if (sc_BlendMode_Screen||sc_BlendMode_PremultipliedAlphaAuto)
{
float l9_84;
#if (sc_BlendMode_PremultipliedAlphaAuto)
{
l9_84=clamp(l9_57,0.0,1.0);
}
#else
{
l9_84=l9_57;
}
#endif
l9_83=vec4(l9_58.xyz*l9_84,l9_84);
}
#else
{
l9_83=l9_58;
}
#endif
l9_82=l9_83;
}
#endif
l9_80=l9_82;
}
#endif
l9_79=l9_80;
}
#endif
l9_73=l9_79;
}
#endif
l9_72=l9_73;
}
#endif
l9_59=l9_72;
}
#endif
vec4 l9_85;
if (PreviewEnabled==1)
{
vec4 l9_86;
if (((PreviewVertexSaved*1.0)!=0.0) ? true : false)
{
l9_86=PreviewVertexColor;
}
else
{
l9_86=vec4(0.0);
}
l9_85=l9_86;
}
else
{
l9_85=l9_59;
}
vec4 l9_87=sc_OutputMotionVectorsIfNeeded(varPos,max(l9_85,vec4(0.0)));
vec4 l9_88=clamp(l9_87,vec4(0.0),vec4(1.0));
#if (sc_OITDepthBoundsPass)
{
#if (sc_OITDepthBoundsPass)
{
float l9_89=clamp(viewSpaceDepth()/1000.0,0.0,1.0);
sc_writeFragData0Internal(vec4(max(0.0,1.0-(l9_89-0.0039215689)),min(1.0,l9_89+0.0039215689),0.0,0.0),sc_UniformConstants.x,sc_ShaderCacheConstant);
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
vec2 l9_90=sc_ScreenCoordsGlobalToView(l9_0);
#if (sc_OITMaxLayers4Plus1)
{
if ((gl_FragCoord.z-texture(sc_OITFrontDepthTexture,l9_90).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
int l9_91=encodeDepth(viewSpaceDepth(),texture(sc_OITFilteredDepthBoundsTexture,l9_90).xy);
float l9_92=packValue(l9_91);
int l9_99=int(l9_88.w*255.0);
float l9_100=packValue(l9_99);
sc_writeFragData0Internal(vec4(packValue(l9_91),packValue(l9_91),packValue(l9_91),packValue(l9_91)),sc_UniformConstants.x,sc_ShaderCacheConstant);
sc_writeFragData1(vec4(l9_92,packValue(l9_91),packValue(l9_91),packValue(l9_91)));
sc_writeFragData2(vec4(l9_100,packValue(l9_99),packValue(l9_99),packValue(l9_99)));
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
vec2 l9_103=sc_ScreenCoordsGlobalToView(l9_0);
#if (sc_OITMaxLayers4Plus1)
{
if ((gl_FragCoord.z-texture(sc_OITFrontDepthTexture,l9_103).x)<=getFrontLayerZTestEpsilon())
{
discard;
}
}
#endif
int l9_104[8];
int l9_105[8];
int l9_106=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_106<8)
{
l9_104[l9_106]=0;
l9_105[l9_106]=0;
l9_106++;
continue;
}
else
{
break;
}
}
int l9_107;
#if (sc_OITMaxLayers8)
{
l9_107=2;
}
#else
{
l9_107=1;
}
#endif
int l9_108=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_108<l9_107)
{
vec4 l9_109;
vec4 l9_110;
vec4 l9_111;
if (l9_108==0)
{
l9_111=texture(sc_OITAlpha0,l9_103);
l9_110=texture(sc_OITDepthLow0,l9_103);
l9_109=texture(sc_OITDepthHigh0,l9_103);
}
else
{
l9_111=vec4(0.0);
l9_110=vec4(0.0);
l9_109=vec4(0.0);
}
vec4 l9_112;
vec4 l9_113;
vec4 l9_114;
if (l9_108==1)
{
l9_114=texture(sc_OITAlpha1,l9_103);
l9_113=texture(sc_OITDepthLow1,l9_103);
l9_112=texture(sc_OITDepthHigh1,l9_103);
}
else
{
l9_114=l9_111;
l9_113=l9_110;
l9_112=l9_109;
}
if (any(notEqual(l9_112,vec4(0.0)))||any(notEqual(l9_113,vec4(0.0))))
{
int l9_115[8]=l9_104;
unpackValues(l9_112.w,l9_108,l9_115);
unpackValues(l9_112.z,l9_108,l9_115);
unpackValues(l9_112.y,l9_108,l9_115);
unpackValues(l9_112.x,l9_108,l9_115);
unpackValues(l9_113.w,l9_108,l9_115);
unpackValues(l9_113.z,l9_108,l9_115);
unpackValues(l9_113.y,l9_108,l9_115);
unpackValues(l9_113.x,l9_108,l9_115);
int l9_124[8]=l9_105;
unpackValues(l9_114.w,l9_108,l9_124);
unpackValues(l9_114.z,l9_108,l9_124);
unpackValues(l9_114.y,l9_108,l9_124);
unpackValues(l9_114.x,l9_108,l9_124);
}
l9_108++;
continue;
}
else
{
break;
}
}
vec4 l9_129=texture(sc_OITFilteredDepthBoundsTexture,l9_103);
vec2 l9_130=l9_129.xy;
int l9_131;
#if (sc_SkinBonesCount>0)
{
l9_131=encodeDepth(((1.0-l9_129.x)*1000.0)+getDepthOrderingEpsilon(),l9_130);
}
#else
{
l9_131=0;
}
#endif
int l9_132=encodeDepth(viewSpaceDepth(),l9_130);
vec4 l9_133;
l9_133=l9_88*l9_88.w;
vec4 l9_134;
int l9_135=0;
for (int snapLoopIndex=0; snapLoopIndex==0; snapLoopIndex+=0)
{
if (l9_135<8)
{
int l9_136=l9_104[l9_135];
int l9_137=l9_132-l9_131;
bool l9_138=l9_136<l9_137;
bool l9_139;
if (l9_138)
{
l9_139=l9_104[l9_135]>0;
}
else
{
l9_139=l9_138;
}
if (l9_139)
{
vec3 l9_140=l9_133.xyz*(1.0-(float(l9_105[l9_135])/255.0));
l9_134=vec4(l9_140.x,l9_140.y,l9_140.z,l9_133.w);
}
else
{
l9_134=l9_133;
}
l9_133=l9_134;
l9_135++;
continue;
}
else
{
break;
}
}
sc_writeFragData0Internal(l9_133,sc_UniformConstants.x,sc_ShaderCacheConstant);
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
if (abs(gl_FragCoord.z-texture(sc_OITFrontDepthTexture,sc_ScreenCoordsGlobalToView(l9_0)).x)>getFrontLayerZTestEpsilon())
{
discard;
}
sc_writeFragData0Internal(l9_88,sc_UniformConstants.x,sc_ShaderCacheConstant);
}
#endif
}
#else
{
sc_writeFragData0Internal(l9_87,sc_UniformConstants.x,sc_ShaderCacheConstant);
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
