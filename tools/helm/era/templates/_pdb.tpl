{{- define "pdb.tpl" }}
{{- if and (ne .Values.scaling.minAvailableReplicas 0.0) (gt .Values.scaling.minReplicas 1.0) -}}
kind: PodDisruptionBudget
apiVersion: policy/v1
metadata:
  name: {{ .name }}-pdb
  labels: {{ .labels | nindent 4 }}
spec:
  minAvailable: {{ .Values.scaling.minAvailableReplicas }}
  selector:
    matchLabels:
      name: {{ .name }}
{{- end -}}
{{- end -}}