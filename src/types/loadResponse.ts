/**
 * SPDX-FileCopyrightText: 2024 CAD Viewer Contributors
 * SPDX-License-Identifier: MIT
 */

export interface LoadResponse {
	id: number
	name: string
	size: number
	mime: string
	path: string
	content: string
	contentType: string
	error?: string
}
